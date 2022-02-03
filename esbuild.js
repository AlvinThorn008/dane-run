import esbuild from 'esbuild';
import serve, { error, log } from 'create-serve';

const PROD = process.argv.slice(2).includes("--prod");
const WATCH = process.argv.slice(2).includes("--watch");

esbuild.build({
    bundle: true,
    entryPoints: ["src/index.ts"],
    outfile: "public/js/bundle.js",
    format: "esm",
    write: true,
    minify: PROD,
    watch: WATCH && {
        onRebuild(err, res) {  
            serve.update();
            err ? error("Build failed") : log("Build succeeded")
        }
    }
}).catch(() => process.exit(1));

if (WATCH) {
    serve.start({
        port: 3000,
        root: ".",
        live: true
    });
}


