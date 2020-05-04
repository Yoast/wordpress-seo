import * as results from "./results";
import * as primaryTaxonomies from "./primaryTaxonomies";
import * as activeMarker from "./activeMarker";
import * as markerPauseStatus from "./markerPauseStatus";
import * as snippetEditor from "./snippetEditor";
import * as settings from "./settings";
import * as facebookEditor from "./facebookEditor";
import * as twitterEditor from "./twitterEditor";
import * as fallbacks from "./fallbacks";

const selectors = {
	...facebookEditor,
	...twitterEditor,
	...fallbacks,
	...results,
	...primaryTaxonomies,
	...activeMarker,
	...markerPauseStatus,
	...settings,
	...snippetEditor,
};

export default selectors;
