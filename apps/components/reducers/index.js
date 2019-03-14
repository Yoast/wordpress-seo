import { combineReducers } from "redux";

import contentAnalysis from "../../../packages/yoast-components/composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

export default combineReducers( {
	contentAnalysis,
} );
