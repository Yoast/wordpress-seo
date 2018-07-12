// External dependencies.
import { combineReducers } from "redux";

// Internal dependencies.
import configuration from "./configuration";
import paper from "./paper";

export default combineReducers( {
	configuration,
	paper,
} );
