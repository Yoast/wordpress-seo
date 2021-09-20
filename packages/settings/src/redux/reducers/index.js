import { combineReducers } from "@wordpress/data";
import data from "./data";
import notifications from "./notifications";
import options from "./options";
import save from "./save";
import savedData from "./saved-data";
import themeModifications from "./theme-modifications";
import touchedData from "./touched-data";

export default combineReducers( {
	notifications,
	data,
	touchedData,
	options,
	save,
	savedData,
	themeModifications,
} );
