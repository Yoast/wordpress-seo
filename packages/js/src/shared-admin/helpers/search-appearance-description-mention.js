import { Root, Badge } from "@yoast/ui-library";
import { Fill } from "@wordpress/components";
// import { useState, useCallback } from "@wordpress/element";
import { get } from "lodash";
import { addFilter } from "@wordpress/hooks";
import { StoryComponent } from "@yoast/ui-library/build/elements/tooltip";

/**
 * Adds the mentions.
 *
 * @param {JSX.node[]} mentions The current mentions.
 * @param {string} fieldId The replacement variable editor's field ID.
 *
 * @returns {JSX.node[]} The mentions.
 */
const filterReplacementVariableEditorMentions = (mentions, { fieldId }) => {
	const isRtl = get(window, "wpseoScriptData.metabox.isRtl", false);
	// const [isVisible, setIsVisible] = useState(false);
	// const handleMouseEnter = useCallback(
	// 	() => setIsVisible(true),
	// 	[setIsVisible],
	// );
	// const handleMouseLeave = useCallback(
	// 	() => setIsVisible(false),
	// 	[setIsVisible],
	// );
	mentions.push(
		<Fill
			name={`yoast.replacementVariableEditor.additionalMentions.${fieldId}`}
		>
			<Root context={{ isRtl }}>
				<Badge
					variant="plain"
					className="yst-text-slate-500 yst-relative yst-cursor-pointer"
					aria-describedby={id}
					isVisible="true"
				>
					Date
					<StoryComponent id={fieldId} isVisible="true" /*NOTES: the css properties of the toolpip component should be adjusted for this user case as follow: 
					max-width: 576px; .yst-tooltip--top {yst--translate-x-11} &::before {transform: translateX(-14.8rem);} */>
						The 'Date' variable is fixed and adds 14 chararacters to the length of your meta description.
					</StoryComponent>
				</Badge>
				{/* <Badge
					variant="plain"
					className="yst-text-slate-500"
					aria-describedby={ id }
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					Separator
					{isVisible && (
						<StoryComponent>
							I am the separator tooltip
						</StoryComponent>
					)}
				</Badge> */}
			</Root>
		</Fill>,
	);

	return mentions;
};

export const registerSearchAppearanceDescriptionMention = () => {
	addFilter(
		"yoast.replacementVariableEditor.additionalMentions",
		"yoast/yoast-seo/Mentions",
		filterReplacementVariableEditorMentions,
	);
};
