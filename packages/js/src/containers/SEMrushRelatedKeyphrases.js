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
			getPreference,
			getIsPremium,
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
			isRtl: getPreference( "isRtl", false ),
			userLocale: getPreference( "userLocale", "en_US" ),
			isPremium: getIsPremium(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushChangeCountry,
			setSEMrushNewRequest,
		 } = dispatch( "yoast-seo/editor" );
		return {
			setCountry: ( countryCode ) => {
				setSEMrushChangeCountry( countryCode );
			},
			newRequest: ( countryCode, keyphrase ) => {
				setSEMrushNewRequest( countryCode, keyphrase );
			},
		};
	} ),
] )( RelatedKeyphrasesModalContent );
