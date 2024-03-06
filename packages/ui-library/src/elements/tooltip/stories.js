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

	return (
		// The yst-my-6 class gives more space within the Storybook container, allowing the tooltip to be visible.
		// The flex classes are to position the trigger element in the center of the container.
		<div className="yst-my-6 yst-flex yst-justify-center yst-cursor-pointer">
			<Badge
				variant="plain"
				aria-describedby={ args.id }
				// The parent element nesting the tooltip should have a relative position.
				className="yst-relative"
			>Hover me
				<StoryComponent { ...args } />
			</Badge>
		</div>
	);
};

Factory.args = {
	id: "id-1",
	children: "I am a tooltip",
}

export const badgeShowsATooltipOnHover = (args) => {
	const [isVisible, setIsVisible] = useState(false);
	const handleMouseEnter = useCallback(
		() => setIsVisible(true),
		[setIsVisible],
	);
	const handleMouseLeave = useCallback(
		() => setIsVisible(false),
		[setIsVisible],
	);

	return (
		<div className="yst-my-6 yst-flex yst-justify-center yst-cursor-pointer">
			<Badge
				variant="plain"
				aria-describedby={args.id}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				// The parent element nesting the tooltip should have a relative position.
				className="yst-relative"
			>
				Hover me
				{ isVisible && (
					<StoryComponent {...args} />
				)}
			</Badge>
		</div>
	);
};

badgeShowsATooltipOnHover.args = {
	id: "id-2",
	children: "I am also a tooltip",
};