import { Fragment } from "react";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import CountrySelector from "./modals/CountrySelector";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import SemRushUpsellAlert from "./modals/SemRushUpsellAlert";
import SemRushRequestFailed from "./modals/SemRushRequestFailed";

export default function( { keyphrase, keyphrases, renderAction } ) {

	// Return table etc. All content based on props etc.
	return (
		<Fragment>
			<SemRushUpsellAlert />
			<SemRushLimitReached />
			<SemRushRequestFailed />
			<CountrySelector />
			<KeyphrasesTable />
		</Fragment>
	);
};
