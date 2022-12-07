import { Card, Button } from "../../index";

export default {
	title: "2. Components/Card",
	component: Card,
	parameters: {
		docs: {
			description: {
				component: "A simple card component. It has sub-components for header, content and footer.",
			},
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		children: (
			<>
				<Card.Header>This is Card header!</Card.Header>
				<Card.Content>This is Card content!</Card.Content>
				<Card.Footer>This is Card footer!</Card.Footer>
			</>
		),
	},

};

const Template = ( { children } ) => {
	return (
		<div className="yst-flex yst-gap-5 yst-justify-center">
			<div className="yst-w-1/3">
				<Card>{ children }</Card>
			</div>
		</div>
	);
};

export const Factory = Template.bind( {} );

Factory.parameters = {};

Factory.args = {
	children: (
		<>
			<Card.Header>This is Card header!</Card.Header>
			<Card.Content>This is Card content!</Card.Content>
			<Card.Footer>This is Card footer!</Card.Footer>
		</>
	),
};

export const WithoutHeader = Template.bind( {} );
WithoutHeader.args = {
	children: (
		<>
			<Card.Content className="yst-h-24">This is Card content with a fixed height.</Card.Content>
			<Card.Footer>
				<Button className="yst-w-full">
					 Footer with full-width button
				</Button>
			</Card.Footer>
		</>
	),
};
