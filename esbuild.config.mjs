import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner =
	`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
});

const cssCtx = await esbuild.context({
	entryPoints: ["styles_src.css"],
	bundle: true,
	sourcemap: prod ? false : "inline",
	outfile: "styles.css",
	loader: {
		".svg": "dataurl",
	},
});

if (prod) {
	await Promise.all([context.rebuild(), cssCtx.rebuild()]);
	process.exit(0);
} else {
	await Promise.all([context.watch(), cssCtx.watch()]);
}
