import React from "react";
import { DifficultyBullet } from ".";
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
		},
	},
	render: ( { value } ) => (
		<>
			<DifficultyBullet value={ value } />
			<DifficultyBullet value={ 20 } />
			<DifficultyBullet value={ 35 } />
			<DifficultyBullet value={ 55 } />
			<DifficultyBullet value={ 73 } />
			<DifficultyBullet value={ 90 } />
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
