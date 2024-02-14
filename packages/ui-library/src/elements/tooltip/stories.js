import { StoryComponent } from ".";
import { component } from "./docs";
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
	const handleMouseEnter = () => setIsVisible( true );
	const handleMouseLeave = () => setIsVisible( false );

	return (
		// It gives more space within the Storybook container for the tooltip to be visible.
		<div className="yst-my-4">
			<Badge
				as="button"
				variant="plain"
				onMouseEnter={ handleMouseEnter }
				onMouseLeave={ handleMouseLeave }
				// The parent element nesting the tooltip should have a relative position.
				className="yst-relative"
			> Hover me
				<StoryComponent { ...args } isVisible={ isVisible } />
			</Badge>
		</div>
	);
};

Factory.parameters = {
	controls: { placement: "top" },
};

Factory.args = {
	children: "I'm a tooltip",
};
