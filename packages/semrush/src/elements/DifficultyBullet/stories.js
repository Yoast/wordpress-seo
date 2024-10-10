import React from "react";
import DifficultyBullet from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		value: 12,
	},
	argTypes: {
		value: {
			description: "The percentage of difficulty.",
			control: {
				type: "number",
			},
		},
	},
	render: ( { value } ) => (
		<div className="yst-flex yst-gap-10 yst-pt-14 yst-justify-center">
			<DifficultyBullet value={ value } />
			<DifficultyBullet value={ 20 } />
			<DifficultyBullet value={ 35 } />
			<DifficultyBullet value={ 55 } />
			<DifficultyBullet value={ 73 } />
			<DifficultyBullet value={ 90 } />
		</div>
	),
};


export default {
	title: "2) Elements/DifficultyBullet",
	component: DifficultyBullet,
	argTypes: {
		value: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
};
