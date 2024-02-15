import { StoryComponent } from ".";
import { component } from "./docs";
import { useState, useCallback } from "@wordpress/element";
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
	const handleMouseEnter = useCallback( () => setIsVisible( true ), [ setIsVisible ] );
	const handleMouseLeave = useCallback( () => setIsVisible( false ), [ setIsVisible ] );

	return (
		// It gives more space within the Storybook container for the tooltip to be visible.
		// Applying flex classes only for positioning test.
		<div className="yst-my-4 yst-flex yst-justify-center">
			<Badge
				as="button"
				variant="plain"
				// Add aria-describedby attribute with the ID of the tooltip content
				aria-describedby={ args.id }
				onMouseEnter={ handleMouseEnter }
				onMouseLeave={ handleMouseLeave }
				// The parent element nesting the tooltip should have a relative position.
				className="yst-relative"
			> Hover me
				<StoryComponent { ...args } isVisible={ isVisible }  />
			</Badge>
		</div>
	);
};

Factory.args = {
	id: "id-1",
	children: "I'm a tooltip",
};
