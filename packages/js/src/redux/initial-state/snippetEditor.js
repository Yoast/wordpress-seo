import { get } from "lodash";

import getDefaultReplacementVariables from "../../values/defaultReplaceVariables";

const titleTemplate = get( window, "wpseoScriptData.metabox.title_template", "" );
const descriptionTemplate = get( window, "wpseoScriptData.metabox.metadesc_template", "" );
const title = get( window, "wpseoScriptData.metabox.metadata.title", "" );
const termDescription = get( window, "wpseoScriptData.metabox.metadata.desc", "" );
const description = get( window, "wpseoScriptData.metabox.metadata.metadesc", termDescription );

export const snippetEditorInitialState = {
	mode: "mobile",
	data: {
		title: title || titleTemplate,
		description: description || descriptionTemplate,
		slug: get( window, "wpseoScriptData.metabox.post.slug", "" ),
	},
	wordsToHighlight: [],
	replacementVariables: getDefaultReplacementVariables(),
	uniqueRefreshValue: "",
	templates: {
		title: titleTemplate,
		description: descriptionTemplate,
	},
};
