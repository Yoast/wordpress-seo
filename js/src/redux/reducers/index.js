import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

import isCornerstone from "./cornerstoneContent";
import focusKeyword from "./focusKeyword";
import marksButtonStatus from "./markerButtons";
import snippetEditor from "./snippetEditor";
import analysisDataReducer from "./analysisData";
import preferences from "./preferences";
import settings from "./settings";
import primaryCategory from "./primaryCategory";

export default {
	analysis,
	isCornerstone,
	focusKeyword,
	marksButtonStatus,
	snippetEditor,
	analysisData: analysisDataReducer,
	preferences,
	settings,
	primaryCategory,
};
