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
			getWincherChartData,
			getWincherChartDataTs,
			isWincherNewlyAuthenticated,
			shouldWincherTrackAll,
			getPermalink,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			trackedKeyphrasesChartData: getWincherChartData(),
			isLoggedIn: getWincherLoginStatus(),
			trackAll: shouldWincherTrackAll(),
			chartDataTs: getWincherChartDataTs(),
			websiteId: getWincherWebsiteId(),
			isNewlyAuthenticated: isWincherNewlyAuthenticated(),
			permalink: getPermalink(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNewRequest,
			setWincherRequestSucceeded,
			setWincherRequestFailed,
			setWincherSetKeyphraseLimitReached,
			setWincherChartData,
			setWincherTrackedKeyphrases,
			setWincherTrackingForKeyphrase,
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
			setChartData: ( chartData ) => {
				setWincherChartData( chartData );
			},
		};
	} ),
] )( WincherKeyphrasesTable );
