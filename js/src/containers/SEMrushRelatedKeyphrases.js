/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import RelatedKeyphrasesModalContent from "../components/SEMrushRelatedKeyphrasesModalContent";

export default compose( [
	withSelect( ( select ) => {
		const {
			getFocusKeyphrase,
			getSEMrushSelectedCountry,
			getSEMrushRequestLimitReached,
			getSEMrushRequestResponse,
			getSEMrushRequestIsSuccess,
			getSEMrushIsRequestPending,
			getSEMrushRequestHasData,
			getSEMrushRequestKeyphrase,
		} = select( "yoast-seo/editor" );

		return {
			keyphrase: getFocusKeyphrase(),
			countryCode: getSEMrushSelectedCountry(),
			requestLimitReached: getSEMrushRequestLimitReached(),
			response: getSEMrushRequestResponse(),
			isSuccess: getSEMrushRequestIsSuccess(),
			isPending: getSEMrushIsRequestPending(),
			requestHasData: getSEMrushRequestHasData(),
			lastRequestKeyphrase: getSEMrushRequestKeyphrase(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushChangeCountry,
			setSEMrushNewRequest,
			setSEMrushRequestSucceeded,
			setSEMrushRequestFailed,
			setSEMrushSetRequestLimitReached,
			setSEMrushNoResultsFound,
		 } = dispatch( "yoast-seo/editor" );
		return {
			setCountry: ( countryCode ) => {
				setSEMrushChangeCountry( countryCode );
			},
			newRequest: ( countryCode, keyphrase ) => {
				setSEMrushNewRequest( countryCode, keyphrase );
			},
			setRequestSucceeded: ( response ) => {
				setSEMrushRequestSucceeded( response );
			},
			setRequestFailed: ( response ) => {
				setSEMrushRequestFailed( response );
			},
			setRequestLimitReached: () => {
				setSEMrushSetRequestLimitReached();
			},
			setNoResultsFound: () => {
				setSEMrushNoResultsFound();
			},
		};
	} ),
] )( RelatedKeyphrasesModalContent );
