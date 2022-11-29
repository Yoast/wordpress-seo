import { Card } from "../../index";

export default {
	title: "2. Components/Card",
	component: Card,
	parameters: {
		docs: {
			description: {
				component: "A card component. It has sub components for header, content and footer.",
			},
		},
	},
	argTypes: {
		children: { control: false },
	},
	args: {
		children: ( <><Card.Header>This is Card header!</Card.Header>
			<Card.Content>This is Card content!</Card.Content>
			<Card.Footer>This is Card footer!</Card.Footer></> ),
		className: "yst-w-1/3",
	},

};

const Template = ( { className, children } ) => {
	return (
		<div className="yst-flex yst-gap-5 yst-justify-center">
			<Card className={ className }>
				{ children }
			</Card>
		</div>	);
};

export const Factory = Template.bind( {} );

Factory.parameters = {};

Factory.args = {
	children: ( <><Card.Header>This is Card header!</Card.Header>
		<Card.Content>This is Card content!</Card.Content>
		<Card.Footer>This is Card footer!</Card.Footer></> ),
};
