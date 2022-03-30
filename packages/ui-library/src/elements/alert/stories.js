import Alert from ".";

export default {
	title: "1. Elements/Alert",
	component: Alert,
	argTypes: {
		children: { control: "text" },
		as: { options: [ "span", "div" ] },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple alert component.",
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<Alert { ...args }>{ children }</Alert>
);
Factory.parameters = {
	jest: "snapshot",
	controls: { disable: false },
};
Factory.args = {
	children: "Alert Factory",
};

export const Variants = ( args ) => {
	const Link = <a href="https://yoast.com">with a link</a>;
	return (
		<div className="yst-flex yst-flex-col yst-gap-2">
			<Alert variant="info">This is an information alert { Link }. (default)</Alert>
			<Alert variant="warning">This is a warning alert { Link }.</Alert>
			<Alert variant="success" role="alert">This is a success alert { Link }.</Alert>
			<Alert variant="error" role="alert">This is an error alert { Link }.</Alert>
		</div>
	);
};
