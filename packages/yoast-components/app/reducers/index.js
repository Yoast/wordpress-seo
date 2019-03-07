import { combineReducers } from "redux";

import contentAnalysis from "../../composites/Plugin/ContentAnalysis/reducers/contentAnalysisReducer";

export default combineReducers( {
	contentAnalysis,
} );
