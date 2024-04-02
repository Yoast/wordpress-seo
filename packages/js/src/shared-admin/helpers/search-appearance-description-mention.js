// import { useCallback, useState } from "@wordpress/element";
import { Root, Badge, Tooltip } from "@yoast/ui-library";
import { Fill } from "@wordpress/components";
import { get } from "lodash";
import { addFilter } from "@wordpress/hooks";
import styled from "styled-components";

/**
 * Adds the mentions.
 * @param {JSX.node[]} mentions The current mentions.
 * @param {string} fieldId The replacement variable editor's field ID.
 * @returns {JSX.node[]} The mentions.
 */
const filterReplacementVariableEditorMentions = ( mentions, { fieldId } ) => {
	const isRtl = get( window, "wpseoScriptData.metabox.isRtl", false );
	const StyledTooltip = styled( Tooltip )`{
	&::before {
		transform: translateX(-14.8rem);
	  }
	`;

	// const [ isVisible, setIsVisible ] = useState( false );
	// const handleMouseEnter = useCallback(
	// 	() => setIsVisible( true ),
	// 	[ setIsVisible ]
	// );
	// const handleMouseLeave = useCallback(
	// 	() => setIsVisible( false ),
	// 	[ setIsVisible ]
	// );

	if ( fieldId === "yoast-google-preview-description-metabox" ) {
		mentions.push(
			<Fill
				name={ `yoast.replacementVariableEditor.additionalMentions.${fieldId}` }
			>
				<Root context={ { isRtl } }>

					<Badge
						variant="plain"
						className="yst-text-slate-500 yst-relative yst-cursor-pointer"
						aria-describedby={ StyledTooltip.id }
						// onMouseEnter={ handleMouseEnter }
						// onMouseLeave={ handleMouseLeave }
					>
						Date
						{/* { isVisible && ( */}
							<StyledTooltip
								id={ fieldId }
								isVisible="true"
								className="yst--translate-x-11"
							>
								The 'Date' variable is fixed and adds 14 chararacters to
								the length of your meta description.
							</StyledTooltip>
						{/* ) } */}
					</Badge>
					{ /* <Badge
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
				</Badge> */ }
				</Root>
			</Fill>
		);
	}

	return mentions;
};

export const registerSearchAppearanceDescriptionMention = () => {
	addFilter(
		"yoast.replacementVariableEditor.additionalMentions",
		"yoast/yoast-seo/Mentions",
		filterReplacementVariableEditorMentions
	);
};
