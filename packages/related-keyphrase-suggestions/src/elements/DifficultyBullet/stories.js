import React from "react";
import { DifficultyBullet } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "12",
		value: 12,
	},
	argTypes: {
		value: {
			description: "The percentage of difficulty.",
		},
	},
	render: ( args ) => (
		<>
			<DifficultyBullet { ...args } />
			<DifficultyBullet value={ 20 } id="20" />
			<DifficultyBullet value={ 35 } id="35" />
			<DifficultyBullet value={ 55 } id="55" />
			<DifficultyBullet value={ 73 } id="73" />
			<DifficultyBullet value={ 90 } id="90" />
		</>
	),
};


export default {
	title: "2) Elements/DifficultyBullet",
	component: DifficultyBullet,
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-gap-10 yst-pt-14 yst-justify-center">
				<Story />
			</div>
		),
	],
};
