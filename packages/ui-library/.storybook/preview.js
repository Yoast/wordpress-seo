import React, { useEffect } from "react";
import Root from "../src/components/root";
import "./style.css";

const preview = {
	globalTypes: {
		dir: {
			key: "dir",
			name: "Direction",
			description: "Text direction. Can be either left to right or right to left",
			defaultValue: "ltr",
			toolbar: {
				title: "Direction",
				icon: "menu",
				items: [
					{ value: "ltr", title: "LTR - Left to Right" },
					{ value: "rtl", title: "RTL - Right to Left" },
				],
			},
		},
	},
	parameters: {
		viewMode: "docs",
		options: {
			storySort: {
				order: [
					"Introduction",
					"1) Elements",
					"2) Components",
					"3) Patterns",
					"Other exports",
				],
			},
		},
		actions: {
			disable: true,
			argTypesRegex: "^on[A-Z].*",
		},
		backgrounds: {
			"default": "light",
			values: [
				{
					name: "light",
					value: "white",
				},
				{
					name: "dark",
					value: "#1f2124",
				},
				{
					name: "slate",
					value: "#f1f5f9",
				},
			],
		},
		controls: {
			disable: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		docs: {
			source: {
				transform: ( src, storyContext ) => {
					try {
						return storyContext.unboundStoryFn( storyContext ).template;
					} catch ( e ) {
						return null;
					}
				},
			},
		},
	},
	decorators: [
		( Story, context ) => {
			useEffect( () => {
				document.documentElement.setAttribute( "dir", context.globals.dir );
			}, [ context.globals.dir ] );

			return (
				<Root context={ { isRtl: context.globals.dir === "rtl" } }>
					<Story { ...context } />
				</Root>
			);
		},
	],
};

export default preview;
