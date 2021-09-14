/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherKeyphrasesTable from "../components/WincherKeyphrasesTable";
import wincherWebsiteId from "../analysis/wincherWebsiteId";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherRequestLimitReached,
			getWincherRequestResponse,
			getWincherRequestIsSuccess,
			getWincherIsRequestPending,
			getWincherRequestHasData,
			getWincherRequestKeyphrase,
			getWincherIsTracking,
			getWincherTrackedKeyphrases,
			getWincherTrackableKeyphrases,
			getWincherLoginStatus,
			shouldWincherTrackAll,
			getWincherTrackedKeyphrasesChartData,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			requestLimitReached: getWincherRequestLimitReached(),
			response: getWincherRequestResponse(),
			isSuccess: getWincherRequestIsSuccess(),
			isPending: getWincherIsRequestPending(),
			requestHasData: getWincherRequestHasData(),
			lastRequestKeyphrase: getWincherRequestKeyphrase(),
			isTracking: getWincherIsTracking(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			isLoggedIn: getWincherLoginStatus(),
			trackAll: shouldWincherTrackAll(),
			trackedKeyphrasesChartData: getWincherTrackedKeyphrasesChartData(),
			websiteId: wincherWebsiteId(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNewRequest,
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherSetRequestLimitReached,
			setWincherNoResultsFound,
			setTrackingForKeyphrase,
			setTrackedKeyphrases,
			setWincherLoginStatus,
			unsetTrackingForKeyphrase,
			setTrackedKeyphrasesChartData,
			setPendingChartDataRequest,
		} = dispatch( "yoast-seo/editor" );

		return {
			newRequest: ( keyphrase ) => {
				setWincherNewRequest( keyphrase );
			},
			setRequestSucceeded: ( response ) => {
				setWincherRequestSucceeded( response );
			},
			setRequestFailed: ( response ) => {
				setWincherRequestFailed( response );
			},
			setRequestLimitReached: ( limit ) => {
				setWincherSetRequestLimitReached( limit );
			},
			setNoResultsFound: () => {
				setWincherNoResultsFound();
			},
			addTrackingKeyphrase: ( keyphraseObject ) => {
				setTrackingForKeyphrase( keyphraseObject );
			},
			removeTrackingKeyphrase: ( keyphrase ) => {
				unsetTrackingForKeyphrase( keyphrase );
			},
			setTrackingKeyphrases: ( keyphrases ) => {
				setTrackedKeyphrases( keyphrases );
			},
			setTrackingCharts: ( chartData ) => {
				setTrackedKeyphrasesChartData( chartData );
			},
			onAuthentication: ( status, newlyAuthenticated ) => {
				setWincherLoginStatus( status, newlyAuthenticated );
			},
			setPendingChartRequest: ( isPending ) => {
				setPendingChartDataRequest( isPending );
			},
		};
	} ),
] )( WincherKeyphrasesTable );
