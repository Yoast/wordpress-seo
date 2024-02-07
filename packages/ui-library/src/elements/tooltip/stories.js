import { StoryComponent } from ".";
import { component, variants } from "./docs";
import { useState } from "@wordpress/element";
import Badge from "../badge";

export default {
	title: "1) Elements/Tooltip",
	component: StoryComponent,
	argTypes: {
		as: { options: [ "div", "span" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => {
	const [ isVisible, setIsVisible ] = useState( false );

	return (
		<Badge
			as="button"
			variant="plain"
			onMouseEnter={ () => setIsVisible( true ) }
			onMouseLeave={ () => setIsVisible( false ) }
		> Hover me
			<StoryComponent { ...args } isVisible={ isVisible } />
		</Badge>
	);
};

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	children: "Tooltips provide contextual information about an element when users hover over it.",
};
export const Variants = ( args ) => (
	<div className="" />
);

Variants.parameters = { docs: { description: { story: variants } } };
