/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./*.html",
		"./src/**/*.{js,ts,html}",
		"./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [require("flowbite/plugin")],
};
