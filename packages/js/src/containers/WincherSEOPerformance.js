/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformanceModalContent from "../components/WincherSEOPerformanceModalContent";

export default compose( [
	withSelect( ( select ) => {
		const {
			isWincherNewlyAuthenticated,
			getWincherKeyphraseLimitReached,
			getWincherLimit,
			getWincherLoginStatus,
			getWincherRequestIsSuccess,
			getWincherRequestResponse,
			getWincherTrackableKeyphrases,
			hasWincherTrackedKeyphrases,
			shouldWincherAutomaticallyTrackAll,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			hasTrackedKeyphrases: hasWincherTrackedKeyphrases(),
			isLoggedIn: getWincherLoginStatus(),
			isNewlyAuthenticated: isWincherNewlyAuthenticated(),
			isSuccess: getWincherRequestIsSuccess(),
			keyphraseLimitReached: getWincherKeyphraseLimitReached(),
			limit: getWincherLimit(),
			response: getWincherRequestResponse(),
			shouldTrackAll: shouldWincherAutomaticallyTrackAll(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherLoginStatus,
		} = dispatch( "yoast-seo/editor" );

		return {
			setRequestSucceeded: ( response ) => {
				setWincherRequestSucceeded( response );
			},
			setRequestFailed: ( response ) => {
				setWincherRequestFailed( response );
			},
			onAuthentication: ( status, newlyAuthenticated ) => {
				setWincherLoginStatus( status, newlyAuthenticated );
			},
		};
	} ),
] )( WincherSEOPerformanceModalContent );
