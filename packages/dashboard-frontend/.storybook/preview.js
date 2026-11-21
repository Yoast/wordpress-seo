import { Root } from "@yoast/ui-library";
import React, { useEffect } from "react";
import "./style.css";
import colors from "tailwindcss/colors";

/** @type { import("@storybook/react").Preview } */
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
		layout: "padded",
		backgrounds: {
			"default": "slate",
			values: [
				{
					name: "light",
					value: colors.neutral[ "50" ],
				},
				{
					name: "dark",
					value: colors.neutral[ "950" ],
				},
				{
					name: "slate",
					value: colors.slate[ "100" ],
				},
			],
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
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
