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
 *
 * @returns {JSX.node[]} The mentions.
 */
const filterReplacementVariableEditorMentions = ( mentions, { fieldId } ) => {
	const isRtl = get( window, "wpseoScriptData.metabox.isRtl", false );
	mentions.push(
		<Fill
			name={ `yoast.replacementVariableEditor.additionalMentions.${fieldId}` }
		>
			<Root context={ { isRtl } }>
				<Badge variant="plain" className="yst-text-slate-500" isVisible="true">
					Date
					<StoryComponent id={ fieldId } isVisible="true">
						I am the date tooltip with a long text like
						A grasshopper spent the summer hopping about in the sun and singing to his
						heart's content. One day, an ant went hurrying by, looking very hot and weary.
					</StoryComponent>
				</Badge>
				<Badge variant="plain" className="yst-text-slate-500">
					Separator
					<StoryComponent id={ fieldId } position="left">
						I am the separator tooltip
					</StoryComponent>
				</Badge>
			</Root>
		</Fill>
	);

	return mentions;
};

export const registerSearchAppearanceDescriptionMention = () => {
	addFilter( "yoast.replacementVariableEditor.additionalMentions", "yoast/yoast-seo/Mentions", filterReplacementVariableEditorMentions );
};
