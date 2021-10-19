/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherKeyphrasesTable from "../components/WincherKeyphrasesTable";
import wincherWebsiteId from "../analysis/wincherWebsiteId";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherTrackedKeyphrases,
			getWincherTrackableKeyphrases,
			getWincherLoginStatus,
			getWincherChartData,
			getWincherChartDataTs,
			isWincherNewlyAuthenticated,
			shouldWincherTrackAll,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			trackedKeyphrasesChartData: getWincherChartData(),
			isLoggedIn: getWincherLoginStatus(),
			trackAll: shouldWincherTrackAll(),
			chartDataTs: getWincherChartDataTs(),
			websiteId: wincherWebsiteId(),
			isNewlyAuthenticated: isWincherNewlyAuthenticated(),
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
			setPendingChartDataRequest,
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
			setPendingChartRequest: ( isPending ) => {
				setPendingChartDataRequest( isPending );
			},
		};
	} ),
] )( WincherKeyphrasesTable );
