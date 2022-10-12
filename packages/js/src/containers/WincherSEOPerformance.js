/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformance from "../components/WincherSEOPerformance";

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
			getWincherAllKeyphrasesMissRanking,
			getWincherPermalink,
			shouldWincherAutomaticallyTrackAll,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			allKeyphrasesMissRanking: getWincherAllKeyphrasesMissRanking(),
			isLoggedIn: getWincherLoginStatus(),
			isNewlyAuthenticated: isWincherNewlyAuthenticated(),
			isSuccess: getWincherRequestIsSuccess(),
			keyphraseLimitReached: getWincherKeyphraseLimitReached(),
			limit: getWincherLimit(),
			response: getWincherRequestResponse(),
			shouldTrackAll: shouldWincherAutomaticallyTrackAll(),
			permalink: getWincherPermalink(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherWebsiteId,
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
			onAuthentication: ( status, newlyAuthenticated, websiteId ) => {
				setWincherWebsiteId( websiteId );
				setWincherLoginStatus( status, newlyAuthenticated );
			},
		};
	} ),
] )( WincherSEOPerformance );
