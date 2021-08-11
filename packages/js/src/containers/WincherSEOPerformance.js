/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformanceModalContent from "../components/WincherSEOPerformanceModalContent";
import {setTrackingForKeyphrase, toggleTrackingForKeyphrase} from "../redux/actions";

export default compose( [
	withSelect( ( select ) => {
		const {
			getFocusKeyphrase,
			getWincherRequestLimitReached,
			getWincherRequestResponse,
			getWincherRequestIsSuccess,
			getWincherIsRequestPending,
			getWincherRequestHasData,
			getWincherRequestKeyphrase,
			getWincherIsTracking,
			getWincherTrackedKeyphrases,
		} = select( "yoast-seo/editor" );

		return {
			keyphrase: getFocusKeyphrase(),
			requestLimitReached: getWincherRequestLimitReached(),
			response: getWincherRequestResponse(),
			isSuccess: getWincherRequestIsSuccess(),
			isPending: getWincherIsRequestPending(),
			requestHasData: getWincherRequestHasData(),
			lastRequestKeyphrase: getWincherRequestKeyphrase(),
			isTracking: getWincherIsTracking(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNewRequest,
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherSetRequestLimitReached,
			setWincherNoResultsFound,
			toggleTrackingForKeyphrase,
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
			toggleKeyphraseTracking: ( keyphrase ) => {
				toggleTrackingForKeyphrase( keyphrase );
			},
			setTrackingKeyphrases: ( keyphrases ) => {
				setTrackedKeyphrases( keyphrases );
			},
		};
	} ),
] )( WincherSEOPerformanceModalContent );
