import React from "react";
import { noop } from "lodash";
import { KeyphrasesTable } from ".";
import { component } from "./docs";
import { Factory as ButtonFactory } from "../../elements/TableButton/stories";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		renderButton: ButtonFactory.render,
		relatedKeyphrases: [],
		isPending: false,
		columnNames: [ "Keyword", "Search Volume", "Trends", "Keyword Difficulty Index", "Intent" ],
		userLocale: "en",
		data: [
			[
				"speed test",
				"13600000",
				"0.44,1.00,0.44,0.44,0.44,0.24,0.24,0.36,0.44,0.44,0.44,0.44",
				"9",
				"0",
			],
			[
				"internet speed test",
				"7480000",
				"0.82,0.0",
				"50",
				"0,2",
			],
			[
				"automated test",
				"1500000",
				"0.20,0.24,0.24,0.16,0.36,0.29,0.66,0.81,0.36,0.36,0.20,0.16",
				"90",
				"3",
			],
			[
				"test",
				"1500000",
				"0.36,0.19,0.29,0.16,0.16,0.16,0.16,0.29,0.16,0.19,0.16,0.19",
				"30",
				"0,2,3,1",
			],
			[
				"wifi speed test",
				"823000",
				"1.00,0.44,0.44,0.44,0.54,0.44,0.44,0.54,0.54,0.54,0.54,0.54",
				"15",
				"0,2",
			],
			[
				"typing test",
				"550000",
				"0.55,0.55,0.55,0.45,0.36,0.55,0.55,0.55,0.45,0.36,0.36,0.55",
				"95",
				"0,3",
			],
			[
				"accesability test",
				"301000",
				"0.36,0.44,0.44,0.44,0.44,0.54,0.44,0.54,0.36,0.44,0.44,0.29",
				"80",
				"0",
			],
			[
				"seo test",
				"301000",
				"0.66,0.54,0.54,0.54,0.66,0.54,0.66,0.66,0.54,0.44,0.44,0.54",
				"86",
				"3",
			],
			[
				"related keyphrase test",
				"246000",
				"0.66,0.66,0.54,0.81,1.00,0.81,0.81,0.81,0.66,0.54,0.54,0.54",
				"60",
				"1,3",
			],
			[
				"storybook tests",
				"246000",
				"0.81,0.54,0.44,0.54,0.44,0.13,0.20,0.04,0.06,0.07,0.20,0.29",
				"72",
				"1",
			],
		],
	},
	argTypes: {
		data: {
			description: "Array of keyphrase objects, contain keyphrase, intent, volume, trend, and difficulty.",
		},
	},
	render: ( args ) => <KeyphrasesTable { ...args } />,
};

export const LoadingTable = () => <KeyphrasesTable renderButton={ noop } isPending={ true } />;

export const WithoutButtons = () => <KeyphrasesTable data={ Factory.args.data } columnNames={ Factory.args.columnNames } />;

export default {
	title: "1) Components/KeyphrasesTable",
	component: KeyphrasesTable,
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-max-w-3xl yst-px-8">
				<Story />
			</div>
		),
	],
	argTypes: {
		userLocale: {
			description: "The locale used for formatting the search volume. Should be without country code, for example 'en' not 'en_US'. Fallback to the browser language.",
		},
	},
};
