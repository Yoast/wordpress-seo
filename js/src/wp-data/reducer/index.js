/* External dependencies */
import { combineReducers } from "@wordpress/data";

/* Internal dependencies */
import taxonomiesReducer from "./taxonomies";
import termsReducer from "./terms";

export default combineReducers( {
	taxonomies: taxonomiesReducer,
	terms: termsReducer,
} );
