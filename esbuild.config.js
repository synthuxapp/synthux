import * as esbuild from 'esbuild';
import fs from 'fs';

const isWatch = process.argv.includes('--watch');

// ─── MV3 Compliance ─────────────────────────────────────────────────────────
// jsPDF's output() contains "pdfobjectnewwindow" and "pdfjsnewwindow" code
// paths that dynamically create <script>/<iframe> elements loading remote
// resources (cdnjs.cloudflare.com, PDF.js viewer).  We only use the 'blob'
// output path, but esbuild bundles all code paths.  Chrome Web Store rejects
// extensions containing createElement("script") + .src = URL patterns even
// if the URL itself is empty.  This plugin replaces the entire dead case
// blocks with no-ops at build time so the bundle stays fully self-contained.
const mv3CompliancePlugin = {
  name: 'mv3-remove-remote-code',
  setup(build) {
    build.onLoad({ filter: /jspdf/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');

      // 1. Remove CDN URLs (belt-and-suspenders)
      contents = contents.replace(
        /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/pdfobject\/[\d.]+\/pdfobject\.min\.js/g,
        ''
      );

      // 2. Replace the entire "pdfobjectnewwindow" case block with a throw
      //    Matches: case "pdfobjectnewwindow": ... up to the next case "pdfjsnewwindow":
      contents = contents.replace(
        /case\s*"pdfobjectnewwindow"\s*:[\s\S]*?(?=case\s*"pdfjsnewwindow"\s*:)/g,
        'case "pdfobjectnewwindow": throw new Error("pdfobjectnewwindow is disabled for MV3 compliance.");\n      '
      );

      // 3. Replace the entire "pdfjsnewwindow" case block with a throw
      //    Matches: case "pdfjsnewwindow": ... up to the next case "dataurlnewwindow":
      contents = contents.replace(
        /case\s*"pdfjsnewwindow"\s*:[\s\S]*?(?=case\s*"dataurlnewwindow"\s*:)/g,
        'case "pdfjsnewwindow": throw new Error("pdfjsnewwindow is disabled for MV3 compliance.");\n      '
      );

      return { contents, loader: 'js' };
    });
  },
};

const buildOptions = {
  entryPoints: ['src/sidepanel/app.js'],
  bundle: true,
  outdir: 'extension/sidepanel',
  format: 'esm',
  target: 'chrome120',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  logLevel: 'info',
  plugins: [mv3CompliancePlugin],
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('👀 Watching for changes...');
} else {
  await esbuild.build(buildOptions);
  console.log('✅ Build complete!');
}
