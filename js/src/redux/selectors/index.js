import social from "./social";
import * as results from "./results";
import * as primaryTaxonomies from "./primaryTaxonomies";
import * as activeMarker from "./activeMarker";
import * as markerPauseStatus from "./markerPauseStatus";
import * as snippetEditor from "./snippetEditor";
import * as settings from "./settings";

const selectors = {
	...social,
	...results,
	...primaryTaxonomies,
	...activeMarker,
	...markerPauseStatus,
	...settings,
	...snippetEditor,
};

export default selectors;
