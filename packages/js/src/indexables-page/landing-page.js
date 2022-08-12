/* global yoastIndexingData, wpseoIndexablesPageData */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import NotEnoughContent from "./components/not-enough-content";
import NotEnoughAnalysedContent from "./components/not-enough-analysed-content";
import IndexationView from "./components/indexation-view";
import IndexablesPage from "./indexables-page";
import { Alert } from "@yoast/ui-library";

/* eslint-disable complexity */

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
function LandingPage() {
	const [ indexingState, setIndexingState ] = useState( () => parseInt( yoastIndexingData.amount, 10 ) === 0 ? "already_done" : "idle" );
	const setupInfo = wpseoIndexablesPageData.setupInfo;

	if ( window.wpseoIndexablesPageData?.environment === "staging" ) {
		return <div
			className="yst-max-w-full yst-mt-6 "
		>
			<Alert variant="info">{ __( "This functionality is disabled in staging environments.", "wordpress-seo" ) }</Alert>
		</div>;
	} else if ( setupInfo && Object.values( setupInfo.enabledFeatures ).every( value => value === false ) ) {
		// @TODO: needs UX
		return <span>All features deactivated.</span>;
	} else if ( setupInfo && setupInfo.enoughContent === false ) {
		return <NotEnoughContent />;
	} else if ( setupInfo && setupInfo.enoughAnalysedContent === false ) {
		return <NotEnoughAnalysedContent
			indexablesList={ setupInfo.postsWithoutKeyphrase }
			seoEnabled={ setupInfo.enabledFeatures.isSeoScoreEnabled }
		/>;
	}
	return ( indexingState === "already_done" || indexingState === "completed" ) ? <IndexablesPage setupInfo={ setupInfo } /> : <IndexationView setIndexingState={ setIndexingState } />;
}

export default LandingPage;
