import Navigation from ".";

export default {
	title: "2. Components/Sidebar Navigation",
	component: Navigation,
	argTypes: {
		
	},
	parameters: {
		docs: {
			description: {
				component: "A sidebar navigation component.",
			},
		},
	},
};

const Template = ( args ) => {
	<Navigation>{args}</Navigation>
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	
};
Factory.args = {}