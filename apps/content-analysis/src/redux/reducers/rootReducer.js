// External dependencies.
import { combineReducers } from "redux";

// Internal dependencies.
import configuration from "./configuration";
import options from "./options";
import paper from "./paper";
import { performance } from "./performance";
import results from "./results";
import worker from "./worker";

export default combineReducers( {
	configuration,
	options,
	paper,
	performance,
	results,
	worker,
} );
