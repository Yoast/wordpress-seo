import FeatureUpsell from ".";
import { useToggleState } from "../../hooks";
import { Button } from "../..";
import { useCallback } from "@wordpress/element";

export default {
	title: "2) Components/Feature upsell",
	component: FeatureUpsell,
	parameters: {
		docs: {
			description: {
				component: "A feature upsell component.",
			},
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		children: <p className="yst-p-2 yst-bg-blue-700 yst-text-white">Content that will be grayscale.</p>,
	},
};

const Template = args => {
	const [ shouldUpsell, , , setShouldUpsellTrue, setShouldUpsellFalse ] = useToggleState( args.shouldUpsell );
	const disableUpsell = useCallback( ( e ) => {
		e.preventDefault();
		setShouldUpsellFalse();
		return false;
	}, [ setShouldUpsellFalse ] );

	const { children, ...props } = args;

	return (
		<FeatureUpsell { ...props } shouldUpsell={ shouldUpsell } onClick={ disableUpsell }>
			{ children }
			{ ! shouldUpsell &&
			<Button onClick={ setShouldUpsellTrue } className="yst-mt-4">
				Back to&nbsp;<code>shouldUpsell = true</code>
			</Button> }
		</FeatureUpsell>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};

export const Card = Template.bind( {} );
Card.args = {
	variant: "card",
	cardLink: "#",
	cardText: "Upgrade",
};
Card.parameters = {
	docs: {
		description: {
			story: "When using the `card` variant. You should provide a `cardLink` and a `cardText`.",
		},
	},
};
