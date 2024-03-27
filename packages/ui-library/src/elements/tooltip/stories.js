import React, { useCallback, useState } from "react";
import Tooltip from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Badge from "../badge";
import { component, badgeWithATooltip } from "./docs";

export const Factory = {
	render: (args) => {
		return (
			<div className="yst-relative" aria-describedby={args.id}>
				Element containing a tooltip.
				<Tooltip {...args} />
			</div>
		);
	},
	parameters: {
		controls: { disable: false },
	},
	args: {
		id: "id-1",
		children: "I am a tooltip",
	},
};

export const BadgeShowsATooltipOnHover = {
	render: (args) => {
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
			<Badge
				variant="plain"
				aria-describedby={args.id}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className="yst-relative yst-cursor-pointer"
			>
				Hover me
				{isVisible && <Tooltip {...args} />}
			</Badge>
		);
	},
	args: {
		id: "id-2",
		children:
			"I am also a tooltip with long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: { story: badgeWithATooltip },
			source: {
				transform: (argument1, argument2) => {
					console.log({
						argument1,
						argument2: argument2.args.children,
					});
					return ` 
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
				<Badge
				variant="plain"
				aria-describedby="id-2"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className="yst-relative yst-cursor-pointer"
			>
				Hover me
				{isVisible && <Tooltip id="id-2"/>}
			</Badge>
				);
	`;
				},
			},
		},
	},
};

export default {
	title: "1) Elements/Tooltip",
	component: Tooltip,
	argTypes: {
		as: { options: ["div", "span"] },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={[BadgeShowsATooltipOnHover]} />
			),
		},
	},
	decorators: [
		(Story) => (
			<div className="yst-m-20 yst-flex yst-justify-center">
				<Story />
			</div>
		),
	],
};
