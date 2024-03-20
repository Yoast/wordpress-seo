import { StoryComponent } from ".";
import { component } from "./docs";
import { useRef, useEffect, useCallback } from "@wordpress/element";
import Badge from "../badge";

export default {
	title: "1) Elements/Tooltip",
	component: StoryComponent,
	argTypes: {
		as: { control: "select", options: [ "div", "span" ] },
		position: {
			control: "select",
			options: [ "top", "right", "bottom", "left" ],
		},
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => {
	const ref = useRef();

	// The useEffect hook is used to show the tooltip on mount.
	useEffect( () => {
		ref.current.showPopover();
	}, [] );

	return (
		// The yst-my-16 class gives more space within the Storybook container, allowing the tooltip to be visible.
		// The flex classes are to position the trigger element in the center of the container.
		<div className="yst-m-16 yst-flex yst-justify-center">
			<div
				className="yst-cursor-pointer"
				// The aria-describedby attribute is used to associate the tooltip with the trigger element.
				aria-describedby={ args.id }
				id="story-anchor"
			>
				Element containing a tooltip
				<StoryComponent
					ref={ ref }
					{ ...args }
					anchor="story-anchor"
				// the anchor prop is used to attach the tooltip with the trigger element.
				/>
			</div>
		</div>
	);
};

Factory.args = {
	id: "id-1",
	children: "I am a tooltip",
};

export const badgeShowsATooltipOnHover = ( args ) => {
	const ref = useRef();
	const handleMouseEnter = useCallback(
		() => ref.current.showPopover(),
		[ ref ],
	);
	const handleMouseLeave = useCallback(
		() => ref.current.hidePopover(),
		[ ref ],
	);

	return (
		<div className="yst-my-6 yst-flex yst-justify-center">
			<Badge
				variant="plain"
				aria-describedby={ args.id }
				onMouseEnter={ handleMouseEnter }
				onMouseLeave={ handleMouseLeave }
				id="story-anchor-2"
				className="yst-cursor-pointer"
			>
				Hover me
				<StoryComponent ref={ ref } { ...args } anchor="story-anchor-2" />
			</Badge>
		</div>
	);
};

badgeShowsATooltipOnHover.args = {
	id: "id-2",
	children: "I am the Badge tooltip",
};
