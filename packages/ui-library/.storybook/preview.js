import "./style.css";

export const parameters = {
	viewMode: "docs",
	options: {
		storySort: {
			order: [
				"Introduction",
				"1. Elements",
				"2. Components",
				"3. Patterns",
			],
		},
	},
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
	docs: {
		transformSource: ( src, storyContext ) => {
			try {
				return storyContext.unboundStoryFn( storyContext ).template;
			} catch ( e ) {
				return null;
			}
		},
	},
};