import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

import activeKeyword from "./activeKeyword";
import activeTab from "./activeTab";
import isCornerstone from "./cornerstoneContent";
import keywords from "./keywords";
import marksButtonStatus from "./markerButtons";
import snippetEditor from "./snippetEditor";
import analysisDataReducer from "./analysisData";
import preferences from "./preferences";

export default {
	analysis,
	activeKeyword,
	activeTab,
	isCornerstone,
	keywords,
	marksButtonStatus,
	snippetEditor,
	analysisData: analysisDataReducer,
	preferences,
};
