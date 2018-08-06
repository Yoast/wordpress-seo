// External dependencies.
import { combineReducers } from "redux";

// Internal dependencies.
import configuration from "./configuration";
import paper from "./paper";
import results from "./results";

export default combineReducers( {
	configuration,
	paper,
	results,
} );
