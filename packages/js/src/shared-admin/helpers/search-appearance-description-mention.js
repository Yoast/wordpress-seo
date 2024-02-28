import { Root, Badge } from "@yoast/ui-library";
import { Fill } from "@wordpress/components";
import { get } from "lodash";
import { addFilter } from "@wordpress/hooks";
import { StoryComponent } from "@yoast/ui-library/build/elements/tooltip";

/**
 * Adds the mentions.
 *
 * @param {JSX.node[]} mentions The current mentions.
 * @param {string} fieldId The replacement variable editor's field ID.
 * @param {string} type The edit type: title or description.
 *
 * @returns {JSX.node[]} The mentions.
 */
const filterReplacementVariableEditorMentions = ( mentions, { fieldId, type } ) => {
	const isRtl = get( window, "wpseoScriptData.metabox.isRtl", false );
	mentions.push(
		<Fill name={ `yoast.replacementVariableEditor.additionalMentions.${ fieldId }` }>
			<Root context={ { isRtl } }>
				<Badge variant="plain">Separator
					<StoryComponent id={ fieldId } isVisible={ true } position="top">I am a tooltip</StoryComponent>
				</Badge>
			</Root>
		</Fill>
	);

	return mentions;
};

export const registerSearchAppearanceDescriptionMention = () => {
	addFilter( "yoast.replacementVariableEditor.additionalMentions", "yoast/yoast-seo/Mentions", filterReplacementVariableEditorMentions );
};
