import React, { useCallback, useState } from "react";
import Tooltip from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Badge from "../badge";
import { component, badgeShowsATooltipOnHover } from "./docs";

export const Factory = {
	render: ( args ) => {
		return (
			<div className="yst-relative" aria-describedby={ args.id }>
				Element containing a tooltip.
				<Tooltip { ...args } />
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
	render: ( args ) => {
		const [ isVisible, setIsVisible ] = useState( false );
		const handleMouseEnter = useCallback(
			() => setIsVisible( true ),
			[ setIsVisible ],
		);
		const handleMouseLeave = useCallback(
			() => setIsVisible( false ),
			[ setIsVisible ],
		);

		return (
			<Badge
				variant="plain"
				aria-describedby={ args.id }
				onMouseEnter={ handleMouseEnter }
				onMouseLeave={ handleMouseLeave }
				className="yst-relative yst-cursor-pointer"
			>
				Hover me
				{ isVisible && <Tooltip { ...args } /> }
			</Badge>
		);
	},
	name: "Badge shows a tooltip on hover",
	args: {
		id: "id-2",
		children:
			"I am also a tooltip with a long text. Lorem ipsum dolor sit amet. Rem in odit doloribus quo soluta voluptates a atque minus!",
	},
	parameters: {
		controls: { disable: false },
		docs: {
			description: { story: badgeShowsATooltipOnHover },
			source: {
				transform: ( string, storyContext ) => {
					return `
				const [ isVisible, setIsVisible ] = useState( false );
const handleMouseEnter = useCallback(
	() => setIsVisible( true ),
	[ setIsVisible ],
);
const handleMouseLeave = useCallback(
	() => setIsVisible( false ),
	[ setIsVisible ],
);

return (
	<Badge
		variant="plain"
		aria-describedby="${ storyContext.args.id }"
		onMouseEnter={ handleMouseEnter }
		onMouseLeave={ handleMouseLeave }
		className="yst-relative yst-cursor-pointer"
	>
		Hover me
		{ isVisible && <Tooltip id="${ storyContext.args.id }" children="${ storyContext.args.children }"/> }
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
		as: { options: [ "div", "span" ] },
	},
	parameters: {
		docs: {
			description: { component },
			page: () => (
				<InteractiveDocsPage stories={ [ BadgeShowsATooltipOnHover ] } />
			),
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-m-20 yst-flex yst-justify-center">
				<Story />
			</div>
		),
	],
};
