import * as esbuild from 'esbuild';
import fs from 'fs';

const isWatch = process.argv.includes('--watch');

// ─── MV3 Compliance ─────────────────────────────────────────────────────────
// jsPDF's output() contains a "pdfobjectnewwindow" code path that loads a
// script from cdnjs.cloudflare.com.  We never use that path (only 'blob'),
// but esbuild bundles it anyway, causing Chrome Web Store to reject the
// extension for remotely-hosted code.  This plugin strips those URLs at
// build time so the bundle stays fully self-contained.
const mv3CompliancePlugin = {
  name: 'mv3-remove-remote-code',
  setup(build) {
    build.onLoad({ filter: /jspdf/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');
      // Remove CDN URLs that violate MV3 remotely hosted code policy
      contents = contents.replace(
        /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/pdfobject\/[\d.]+\/pdfobject\.min\.js/g,
        ''
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
