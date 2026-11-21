import React, { useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { card, component } from "./docs";
import { Button, Title, FeatureUpsell } from "../..";

const Template = ( { children, ...props } ) => {
	const [ { shouldUpsell = true }, updateArgs ] = useArgs();
	const disableUpsell = useCallback( ( e ) => {
		e.preventDefault();
		updateArgs( { shouldUpsell: false } );
		return false;
	}, [ updateArgs ] );

	const enableUpsell = useCallback( () => updateArgs( { shouldUpsell: true } ), [ updateArgs ] );

	return (
		<FeatureUpsell { ...props } shouldUpsell={ shouldUpsell } onClick={ disableUpsell }>
			<div>
				{ children }
				<div>
					<Button onClick={ enableUpsell } className="yst-mt-4">
						Enable feature upsell
					</Button>
				</div>
			</div>
		</FeatureUpsell>
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
};

export const Card = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
		docs: { description: { story: card } },
	},
	args: {
		variant: "card",
		cardLink: "#",
		cardText: "Upgrade",
	},
};

export default {
	title: "2) Components/Feature upsell",
	component: FeatureUpsell,
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Card ] } />,
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		variant: "default",
		children: (
			<p>
				This is the content that is locked behind the Feature Upsell.
				All the content in here will be grayscale when the upsell is enabled.
				This can best be seen on the button, which is actually our primary button with
				its regular colored background showcasing the grayscale functionality.
			</p>
		),
	},
};
