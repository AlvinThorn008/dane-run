import esbuild from 'esbuild';
import serve, { error, log } from 'create-serve';
import watch  from 'node-watch';

const PROD = process.argv.slice(2).includes("--prod");
const WATCH = process.argv.slice(2).includes("--watch");

esbuild.build({
    bundle: true,
    entryPoints: ["src/index.ts"],
    outfile: "public/js/bundle.js",
    format: "esm",
    write: true,
    minify: PROD,
    sourcemap: true,
    watch: WATCH && {
        onRebuild(err, res) {  
            serve.update();
            err ? error("[-] Failed") : log("[+] Updated")
        }
    }
}).catch(() => process.exit(1));

if (WATCH) {
    watch("public", { recursive: true, filter: f => !/\.bundle.js/.test(f) }, (evt, name) => {
        serve.update();
        log("[+] Updated");
    })

    serve.start({
        port: 3000,
        root: ".",
        live: true
    });
}


