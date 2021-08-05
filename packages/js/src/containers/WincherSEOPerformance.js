/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformanceModalContent from "../components/WincherSEOPerformanceModalContent";

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
		} = select( "yoast-seo/editor" );

		return {
			keyphrase: getFocusKeyphrase(),
			requestLimitReached: getWincherRequestLimitReached(),
			response: getWincherRequestResponse(),
			isSuccess: getWincherRequestIsSuccess(),
			isPending: getWincherIsRequestPending(),
			requestHasData: getWincherRequestHasData(),
			lastRequestKeyphrase: getWincherRequestKeyphrase(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNewRequest,
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherSetRequestLimitReached,
			setWincherNoResultsFound,
		 } = dispatch( "yoast-seo/editor" );
		return {
			newRequest: ( countryCode, keyphrase ) => {
				setWincherNewRequest( countryCode, keyphrase );
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
		};
	} ),
] )( WincherSEOPerformanceModalContent );
