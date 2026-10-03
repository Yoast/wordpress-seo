
import { Badge } from "@yoast/ui-library";

const badgeTypes = {
	premium: {
		label: "Premium",
		variant: "upsell",
	},
	woo: {
		label: "Woo SEO",
		variant: "info",
	},
	ai: {
		label: "AI+",
		variant: "ai",
	},
};

/**
 * The TaskBadge component to display a badge for a task.
 *
 * @param {string} type The type of badge: 'premium', 'woo', 'ai'.
 * @returns {JSX.Element} The TaskBadge component.
 */
export const TaskBadge = ( { type } ) => ( <Badge
	variant={ badgeTypes[ type ].variant }
	size="small"
	className="yst-no-underline"
>
	{ badgeTypes[ type ].label }
</Badge> );
