/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherKeyphrasesTable from "../components/WincherKeyphrasesTable";
import WincherSEOAnalysisFields from "../helpers/fields/WincherSEOAnalysisFields";

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
			websiteID: WincherSEOAnalysisFields.websiteId,
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
			onAuthentication: ( status, newlyAuthenticated ) => {
				setWincherLoginStatus( status, newlyAuthenticated );
			},
		};
	} ),
] )( WincherKeyphrasesTable );
