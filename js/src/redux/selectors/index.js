import { socialSelectors } from "./socialSelectors";
import * as fallbackSelectors from "./fallbackSelectors";
import * as results from "./results";
import * as primaryTaxonomies from "./primaryTaxonomies";
import * as activeMarker from "./activeMarker";
import * as markerPauseStatus from "./markerPauseStatus";

const selectors = {
	...socialSelectors,
	...fallbackSelectors,
	...results,
	...primaryTaxonomies,
	...activeMarker,
	...markerPauseStatus,
};

export default selectors;
