import Root from "../src/components/root";
import "./style.css";

export const globalTypes = {
	dir: {
		key: "dir",
		name: "Direction",
		description: "Text direction. Can be either left to right or right to left",
		defaultValue: "ltr",
		toolbar: {
			showName: true,
			icon: "menu",
			items: [
				{ value: "ltr", title: "LTR - Left to Right" },
				{ value: "rtl", title: "RTL - Right to Left" },
			],
		},
	},
};

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

export const decorators = [
	( Story, context ) => (
		<Root context={ { isRtl: context.globals.dir === "rtl" } }>
			<Story { ...context } />
		</Root>
	),
];
