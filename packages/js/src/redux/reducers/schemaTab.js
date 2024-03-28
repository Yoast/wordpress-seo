import {
	SET_PAGE_TYPE,
	SET_ARTICLE_TYPE,
} from "../actions/schemaTab";

const initialState = {
	pageType: "",
	defaultPageType: "",
	articleType: "",
	defaultArticleType: "",
};

/**
 * A reducer for the SchemaTab object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated SchemaTab results object.
 */
const schemaTabReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_PAGE_TYPE: return { ...state, pageType: action.pageType };
		case SET_ARTICLE_TYPE: return { ...state, articleType: action.articleType };
		default: {
			return state;
		}
	}
};

export default schemaTabReducer;
