import { StoryComponent } from ".";

export default {
	title: "1) Elements/Progress bar",
	component: StoryComponent,
	parameters: {
		docs: {
			description: {
				component: "A simple progress bar component.",
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<StoryComponent { ...args } />
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	min: 0,
	max: 100,
	progress: 50,
};
