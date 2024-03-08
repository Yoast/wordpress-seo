import { StoryComponent } from ".";
import { component } from "./docs";
import { useState, useCallback } from "@wordpress/element";
import Badge from "../badge";

export default {
	title: "1) Elements/Tooltip",
	component: StoryComponent,
	argTypes: {
		as: { options: ["div", "span"] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = (args) => {
	return (
		// The yst-my-24 class gives more space within the Storybook container, allowing the tooltip to be visible.
		// The flex classes are to position the trigger element in the center of the container.
		<div className="yst-m-16 yst-flex yst-justify-center">
			<div
				// The parent element nesting the tooltip should have a relative position.
				className="yst-relative yst-cursor-pointer"
				// The aria-describedby attribute is used to associate the tooltip with the trigger element.
				aria-describedby={args.id}
			>
				Element containing a tooltip.
				<StoryComponent {...args} />
			</div>
		</div>
	);
};

Factory.args = {
	id: "id-1",
	children:
		"I am a tooltip with long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

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
		<div className="yst-my-6 yst-flex yst-justify-center">
			<Badge
				variant="plain"
				aria-describedby={args.id}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				// The parent element nesting the tooltip should have a relative position.
				// className="yst-relative"
				className="yst-relative yst-cursor-pointer"
			>
				Hover me
				{isVisible && <StoryComponent {...args} />}
			</Badge>
		</div>
	);
};

badgeShowsATooltipOnHover.args = {
	id: "id-2",
	children: "I am also a tooltip",
};
