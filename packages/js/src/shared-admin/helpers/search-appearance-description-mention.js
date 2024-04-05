import { useCallback, useState } from "@wordpress/element";
import { Root, Badge, Tooltip } from "@yoast/ui-library";
import { Fill } from "@wordpress/components";
import { get } from "lodash";
import { addFilter } from "@wordpress/hooks";

/**
 * Renders a badge with tooltip for mentions.
 * @param {JSX.node[]} mentionsName The name of the mentions.
 * @param {JSX.node[]} children The children of the tooltip.
 * @returns {JSX.Element} The badge with tooltip.
 */
const MentionsWithTooltip = ( { mentionsName, children } ) => {
	const [ isVisible, setIsVisible ] = useState( false );
	const handleMouseEnter = useCallback(
		() => setIsVisible( true ),
		[ setIsVisible ]
	);
	const handleMouseLeave = useCallback(
		() => setIsVisible( false ),
		[ setIsVisible ]
	);
	return (
		<>
			<Badge
				variant="plain"
				className="yst-text-slate-500 yst-relative yst-cursor-pointer"
				aria-describedby={ Tooltip.id }
				onMouseEnter={ handleMouseEnter }
				onMouseLeave={ handleMouseLeave }
			>
				<span>{ mentionsName }</span>
				{ isVisible && (
					<Tooltip
						id="date-tooltip"
						className="yst--translate-x-10 yst-max-w-lg yst-text-xs"
					>
						{ children }
					</Tooltip>
				) }
			</Badge>
		</>
	);
};

/**
 * Adds the mentions.
 * @param {JSX.node[]} mentions The current mentions.
 * @param {string} fieldId The replacement variable editor's field ID.
 * @returns {JSX.node[]} The mentions.
 */
const filterReplacementVariableEditorMentions = ( mentions, { fieldId } ) => {
	const isRtl = get( window, "wpseoScriptData.metabox.isRtl", false );
	if ( fieldId === "yoast-google-preview-description-metabox"  || fieldId === "yoast-google-preview-description-modal" ) {
		mentions.push(
			<Fill
				name={ `yoast.replacementVariableEditor.additionalMentions.${fieldId}` }
			>
				<Root context={ { isRtl } }>
					<MentionsWithTooltip mentionsName="Date">
						The 'Date' variable is fixed and adds 10 chararacters to
						the length of your meta description.
					</MentionsWithTooltip>
					<span className="yst-p-1" />
					<MentionsWithTooltip mentionsName="Separator">
						The 'Separator' variable is fixed and adds 3 chararacters to
						the length of your meta description.
					</MentionsWithTooltip>
				</Root>
			</Fill>
		);
	}
	return mentions;
};

/**
 * /**
 * Registers the search appearance description mention.
 * @returns {void}
 */
export const registerSearchAppearanceDescriptionMention = () => {
	addFilter(
		"yoast.replacementVariableEditor.additionalMentions",
		"yoast/yoast-seo/Mentions",
		filterReplacementVariableEditorMentions
	);
};
