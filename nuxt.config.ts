import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@pinia/nuxt"],
	app: {
		head: {
			link: [
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon.png",
				},
				{
					rel: "stylesheet",
					href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
				},
			],
			script: [
				{
					src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
					defer: true,
					tagPosition: "bodyClose",
				},
			],
		},
	},
	css: ["materializecss-colors-alone/colors.css"],
	compatibilityDate: "2025-07-15",
	devtools: {
		enabled: false,
	},
	typescript: {
		shim: false,
	},
	devServer: {
		port: 3331,
	},

	imports: {
		autoImport: false,
	},
});
