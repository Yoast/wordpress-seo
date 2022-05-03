/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherKeyphrasesTable from "../components/WincherKeyphrasesTable";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherWebsiteId,
			getWincherTrackedKeyphrases,
			getWincherTrackableKeyphrases,
			getWincherLoginStatus,
			getWincherPermalink,
			getFocusKeyphrase,
			isWincherNewlyAuthenticated,
			shouldWincherTrackAll,
		} = select( "yoast-seo/editor" );

		return {
			focusKeyphrase: getFocusKeyphrase(),
			keyphrases: getWincherTrackableKeyphrases(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			isLoggedIn: getWincherLoginStatus(),
			trackAll: shouldWincherTrackAll(),
			websiteId: getWincherWebsiteId(),
			isNewlyAuthenticated: isWincherNewlyAuthenticated(),
			permalink: getWincherPermalink(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNewRequest,
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherSetKeyphraseLimitReached,
			setWincherTrackedKeyphrases,
			setWincherTrackingForKeyphrase,
			setWincherTrackAllKeyphrases,
			unsetWincherTrackingForKeyphrase,
		} = dispatch( "yoast-seo/editor" );

		return {
			newRequest: () => {
				setWincherNewRequest();
			},
			setRequestSucceeded: ( response ) => {
				setWincherRequestSucceeded( response );
			},
			setRequestFailed: ( response ) => {
				setWincherRequestFailed( response );
			},
			setKeyphraseLimitReached: ( limit ) => {
				setWincherSetKeyphraseLimitReached( limit );
			},
			addTrackedKeyphrase: ( keyphraseObject ) => {
				setWincherTrackingForKeyphrase( keyphraseObject );
			},
			removeTrackedKeyphrase: ( keyphrase ) => {
				unsetWincherTrackingForKeyphrase( keyphrase );
			},
			setTrackedKeyphrases: ( keyphrases ) => {
				setWincherTrackedKeyphrases( keyphrases );
			},
			setHasTrackedAll: () => {
				setWincherTrackAllKeyphrases( false );
			},
		};
	} ),
] )( WincherKeyphrasesTable );
