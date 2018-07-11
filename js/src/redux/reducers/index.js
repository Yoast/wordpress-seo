import analysis from "yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

import activeKeyword from "./activeKeyword";
import activeTab from "./activeTab";
import isCornerstone from "./cornerstoneContent";
import keywords from "./keywords";
import marksButtonStatus from "./markerButtons";
import openSidebarSections from "./openSidebarSections";
import snippetEditor from "./snippetEditor";
import analysisDataReducer from "./analysisData";

export default {
	analysis,
	activeKeyword,
	activeTab,
	isCornerstone,
	keywords,
	marksButtonStatus,
	openSidebarSections,
	snippetEditor,
	analysisData: analysisDataReducer,
};
