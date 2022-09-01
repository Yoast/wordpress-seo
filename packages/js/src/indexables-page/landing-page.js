/* global yoastIndexingData */
import apiFetch from "@wordpress/api-fetch";
import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import AllFeaturesDisabled from "./components/all-features-disabled";
import NotEnoughContent from "./components/not-enough-content";
import NotEnoughAnalysedContent from "./components/not-enough-analysed-content";
import IndexationView from "./components/indexation-view";
import IndexablesPage from "./indexables-page";
import { Alert, Spinner } from "@yoast/ui-library";
import RefreshButton from "./components/refresh-button";

/* eslint-disable complexity */


/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
function LandingPage() {
	const [ indexingState, setIndexingState ] = useState( () => parseInt( yoastIndexingData.amount, 10 ) === 0 ? "already_done" : "idle" );
	const [ setupInfo, setSetupInfo ] = useState( null );
	const [ errorMessage, setErrorMessage ] = useState( null );

	const [ lastRefreshTime, setLastRefreshTime ] = useState( 0 );
	const [ refreshInterval, setRefreshInterval ] = useState( null );

	/**
	 * Wrapper function for the setup_info API callback.
	 *
	 * @returns {void}
	 */
	async function getSetupInfo() {
		if ( ( window.wpseoIndexablesPageData?.environment !== "staging" ) &&
		( indexingState === "already_done" || indexingState === "completed" ) ) {
			setSetupInfo( null );
		   try {
			   const response = await apiFetch( {
				   path: "yoast/v1/setup_info",
				   method: "GET",
			   } );

			   const parsedResponse = await response.json;
			   setSetupInfo( parsedResponse );
		   } catch ( error ) {
			   setErrorMessage( error.message );
		   }
	   }
	}

	const handleRefresh =  useCallback( () => {
		getSetupInfo();

		if ( refreshInterval ) {
			clearInterval( refreshInterval );
		}

		setLastRefreshTime( 0 );
		const interval = setInterval( () => {
			setLastRefreshTime( ( prevCounter ) => prevCounter + 1 );
		}, 60000 );
		setRefreshInterval( interval );
	}, [ getSetupInfo, setLastRefreshTime, refreshInterval ] );

	useEffect( async() => {
		getSetupInfo();
	}, [ indexingState ] );

	if ( window.wpseoIndexablesPageData?.environment === "staging" ) {
		return <div
			className="yst-max-w-full yst-my-6"
		>
			<Alert variant="info">{ __( "This functionality is disabled in staging environments.", "wordpress-seo" ) }</Alert>
		</div>;
	} else if ( indexingState !== "already_done" && indexingState !== "completed" ) {
		return <IndexationView setIndexingState={ setIndexingState } />;
	} else if ( errorMessage !== null ) {
		return (
			<div className="yst-flex yst-max-w-full yst-my-6 yst-justify-center">
				<Alert variant="error">
					{
						sprintf(
							// Translators: %s expands to the error message.
							__( "An error occurred while calculating your content: %s", "wordpress-seo" ),
							errorMessage
						)
					}
				</Alert>
			</div>
		);
	} else if ( setupInfo && Object.values( setupInfo.enabledFeatures ).every( value => value === false ) ) {
		return <AllFeaturesDisabled />;
	} else if ( setupInfo && setupInfo.enoughContent === false ) {
		return (
			<div className=" yst-mt-2 yst-mb-6">
				<RefreshButton onClickCallback={ handleRefresh } lastRefreshTime={ lastRefreshTime } />
				<NotEnoughContent />
			</div>
		);
	} else if ( setupInfo && setupInfo.enoughAnalysedContent === false &&
		( setupInfo.enabledFeatures.isSeoScoreEnabled ||
			setupInfo.enabledFeatures.isReadabilityEnabled ) ) {
		return (
			<div className=" yst-mt-2 yst-mb-6">
				<RefreshButton onClickCallback={ handleRefresh } lastRefreshTime={ lastRefreshTime } />
				<NotEnoughAnalysedContent
					indexablesList={ setupInfo.postsWithoutKeyphrase }
					seoEnabled={ setupInfo.enabledFeatures.isSeoScoreEnabled }
				/>
			</div>
		);
	}
	return setupInfo === null
		? <div className="yst-flex yst-max-w-full yst-my-6 yst-justify-center">
			<div className="yst-flex">
				<Spinner />
				<span className="yst-ml-3">{ __( "Loading...", "wordpress-seo" ) }</span>
			</div>
		</div>
		: <IndexablesPage setupInfo={ setupInfo } />;
}

export default LandingPage;
