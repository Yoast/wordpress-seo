import "../src/elements/style.css";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		disable: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
