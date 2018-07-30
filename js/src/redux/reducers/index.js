import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

import activeTab from "./activeTab";
import isCornerstone from "./cornerstoneContent";
import focusKeyword from "./focusKeyword";
import keywords from "./keywords";
import marksButtonStatus from "./markerButtons";
import snippetEditor from "./snippetEditor";
import analysisDataReducer from "./analysisData";
import preferences from "./preferences";

export default {
	analysis,
	activeTab,
	isCornerstone,
	focusKeyword,
	keywords,
	marksButtonStatus,
	snippetEditor,
	analysisData: analysisDataReducer,
	preferences,
};
