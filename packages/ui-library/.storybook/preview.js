import "./style.css";

export const parameters = {
	actions: {
		disable: true,
		argTypesRegex: "^on[A-Z].*",
	},
	controls: {
		disable: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

// TODO: disable all addons here by default and enable manually?
