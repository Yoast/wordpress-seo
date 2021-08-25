/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformanceModalContent from "../components/WincherSEOPerformanceModalContent";

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
			getWincherTrackableKeyphrases,
			hasWincherNoKeyphrase,
			getWincherAuthenticationStatus,
			getWincherLimit,
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
			hasNoKeyphrase: hasWincherNoKeyphrase(),
			isNewlyAuthenticated: getWincherAuthenticationStatus(),
			limit: getWincherLimit(),
			trackAll: false,
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
			setRequestLimitReached: () => {
				setWincherSetRequestLimitReached();
			},
			setNoResultsFound: () => {
				setWincherNoResultsFound();
			},
			setTrackingKeyphrase: ( keyphrase, isTracking ) => {
				setTrackingForKeyphrase( keyphrase, isTracking );
			},
			setTrackingKeyphrases: ( keyphrases ) => {
				setTrackedKeyphrases( keyphrases );
			},
		};
	} ),
] )( WincherSEOPerformanceModalContent );
