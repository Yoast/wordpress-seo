import { get } from "lodash";
import { facebookInitialState, twitterInitialState } from "./socialAppearance";
import { advancedSettingsInitialState as advancedSettings } from "./advancedSettings";
import { primaryTaxonomies } from "./primaryTaxonomies";
import { schemaInitialState as schemaTab } from "./schemaTab";
import { snippetEditorInitialState as snippetEditor } from "./snippetEditor";
import { analysisInitialState as analysis } from "./analysis";
import { postInitialState as post } from "./post";

export const initialState = {
	facebookEditor: facebookInitialState,
	twitterEditor: twitterInitialState,
	advancedSettings,
	snippetEditor,
	focusKeyword: get( window, "wpseoScriptData.metabox.metadata.focuskw", "" ),
	// This used to be a checkbox, then became a hidden input. For consistency, we set the value to '1'.
	isCornerstone: get( window, "wpseoScriptData.metabox.metadata.is_cornerstone", 0 ) === "1",
	primaryTaxonomies,
	schemaTab,
	post,
	analysis,
	insights: {
		estimatedReadingTime: Number( get( window, "wpseoScriptData.metabox.metadata.estimated-reading-time-minutes", 0 ) ),
		textLength: {},
	},
};
