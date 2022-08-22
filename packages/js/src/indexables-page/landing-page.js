/* global yoastIndexingData */
import apiFetch from "@wordpress/api-fetch";
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import AllFeaturesDisabled from "./components/all-features-disabled";
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
	const [ setupInfo, setSetupInfo ] = useState( null );

	useEffect( async() => {
		if ( ( window.wpseoIndexablesPageData?.environment !== "staging" ) &&
		 ( indexingState === "already_done" || indexingState === "completed" ) ) {
			try {
				const response = await apiFetch( {
					path: "yoast/v1/setup_info",
					method: "GET",
				} );

				const parsedResponse = await response.json;
				setSetupInfo( parsedResponse );
			} catch ( error ) {
				/* eslint-disable-next-line no-warning-comments */
				// @TODO: Throw an error notification.
				console.error( error.message );
				return false;
			}
		}
	}, [ window.wpseoIndexablesPageData, indexingState ] );

	if ( window.wpseoIndexablesPageData?.environment === "staging" ) {
		return <div
			className="yst-max-w-full yst-mt-6 "
		>
			<Alert variant="info">{ __( "This functionality is disabled in staging environments.", "wordpress-seo" ) }</Alert>
		</div>;
	} else if ( indexingState !== "already_done" && indexingState !== "completed" ) {
		return <IndexationView setIndexingState={ setIndexingState } />;
	} else if ( setupInfo && Object.values( setupInfo.enabledFeatures ).every( value => value === false ) ) {
		return <AllFeaturesDisabled />;
	} else if ( setupInfo && setupInfo.enoughContent === false ) {
		return <NotEnoughContent />;
	} else if ( setupInfo && setupInfo.enoughAnalysedContent === false &&
		( setupInfo.enabledFeatures.isSeoScoreEnabled ||
			setupInfo.enabledFeatures.isReadabilityEnabled ) ) {
		return <NotEnoughAnalysedContent
			indexablesList={ setupInfo.postsWithoutKeyphrase }
			seoEnabled={ setupInfo.enabledFeatures.isSeoScoreEnabled }
		/>;
	}
	return setupInfo && <IndexablesPage setupInfo={ setupInfo } />;
}

export default LandingPage;
