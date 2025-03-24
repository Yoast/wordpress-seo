/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { addQueryArgs } from "@wordpress/url";

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
			selectLinkParams,
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
			semrushUpsellLink: addQueryArgs( "https://yoa.st/semrush-prices", selectLinkParams() ),
			premiumUpsellLink: addQueryArgs( "https://yoa.st/413", selectLinkParams() ),
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
