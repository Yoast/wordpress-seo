import { combineReducers } from "@wordpress/data";
import analysisFocusReducer from "./analysis-focus";
import analysisMarkerReducer from "./analysis-marker";
import analysisRelatedReducer from "./analysis-related";
import analysisResearchReducer from "./analysis-research";
import detailDataReducer from "./detail-data";
import detailMetadataReducer from "./detail-metadata";
import getDetailDataReducer from "./get-detail-data";
import listDataReducer from "./list-data";
import optionsReducer from "./options";
import queryReducer from "./query";
import saveReducer from "./save";
import settingsReducer from "./settings";
import originalDetailDataReducer from "./original-data";
import notificationsReducer from "./notifications";

export default combineReducers( {
	notifications: notificationsReducer,
	options: optionsReducer,
	settings: settingsReducer,
	list: combineReducers( {
		data: listDataReducer,
		query: queryReducer,
	} ),
	detail: combineReducers( {
		data: detailDataReducer,
		original: originalDetailDataReducer,
		metadata: detailMetadataReducer,
		save: saveReducer,
		get: getDetailDataReducer,
		analysis: combineReducers( {
			focus: analysisFocusReducer,
			marker: analysisMarkerReducer,
			related: analysisRelatedReducer,
			research: analysisResearchReducer,
		} ),
	} ),
} );
