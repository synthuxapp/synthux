import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/sidepanel/app.js'],
  bundle: true,
  outfile: 'extension/sidepanel/app.bundle.js',
  format: 'esm',
  target: 'chrome120',
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  logLevel: 'info',
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('👀 Watching for changes...');
} else {
  await esbuild.build(buildOptions);
  console.log('✅ Build complete!');
}
