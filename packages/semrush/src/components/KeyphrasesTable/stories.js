import React from "react";
import KeyphrasesTable from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		isPremium: true,
		rows: [
			[
				"speed test",
				"13600000",
				"0.44,1.00,0.44,0.44,0.44,0.24,0.24,0.36,0.44,0.44,0.44,0.44",
				"9",
				"i",
			],
			[
				"internet speed test",
				"7480000",
				"0.67,0.82,0.45,0.82,0.55,0.45,0.45,0.82,0.82,0.67,0.82,0.82",
				"50",
				"i,t",
			],
			[
				"rice purity test",
				"1500000",
				"0.20,0.24,0.24,0.16,0.36,0.29,0.66,0.81,0.36,0.36,0.20,0.16",
				"90",
				"c",
			],
			[
				"test",
				"1500000",
				"0.36,0.19,0.29,0.16,0.16,0.16,0.16,0.29,0.16,0.19,0.16,0.19",
				"30",
				"i,t,c,n",
			],
			[
				"wifi speed test",
				"823000",
				"1.00,0.44,0.44,0.44,0.54,0.44,0.44,0.54,0.54,0.54,0.54,0.54",
				"15",
				"i,t",
			],
			[
				"typing test",
				"550000",
				"0.55,0.55,0.55,0.45,0.36,0.55,0.55,0.55,0.45,0.36,0.36,0.55",
				"95",
				"i,c",
			],
			[
				"bdsm test",
				"301000",
				"0.36,0.44,0.44,0.44,0.44,0.54,0.44,0.54,0.36,0.44,0.44,0.29",
				"80",
				"i",
			],
			[
				"iq test",
				"301000",
				"0.66,0.54,0.54,0.54,0.66,0.54,0.66,0.66,0.54,0.44,0.44,0.54",
				"86",
				"c",
			],
			[
				"autism test",
				"246000",
				"0.66,0.66,0.54,0.81,1.00,0.81,0.81,0.81,0.66,0.54,0.54,0.54",
				"60",
				"n,c",
			],
			[
				"free covid tests",
				"246000",
				"0.81,0.54,0.44,0.54,0.44,0.13,0.20,0.04,0.06,0.07,0.20,0.29",
				"72",
				"n",
			],
		],
	},
	argTypes: {
		rows: {
			description: "Array of keyphrase objects, contain keyphrase, intent, volume, trend, and difficulty.",
			control: {
				type: "object",
			},
		},
	},
	render: ( { rows, isPremium } ) =>
		<div className="yst-max-w-3xl yst-px-8">
			<KeyphrasesTable rows={ rows } isPremium={ isPremium } />
		</div>,
};

export const LoadingTable = () => <div className="yst-max-w-3xl yst-px-8"><KeyphrasesTable isPremium={ true } /></div>;

export const WithoutPremium = () => <div className="yst-max-w-3xl yst-px-8"><KeyphrasesTable rows={ Factory.args.rows } isPremium={ false } /></div>;

export default {
	title: "1) Components/KeyphrasesTable",
	component: KeyphrasesTable,
	argTypes: {
		rows: { control: "array" },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
