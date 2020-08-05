/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import RelatedKeyphrasesModalContent from "../components/RelatedKeyphrasesModalContent";

export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
			countryCode: select( "yoast-seo/editor" ).getSEMrushSelectedCountry(),
			requestLimitReached: select( "yoast-seo/editor" ).getSEMrushRequestLimitReached(),
			response: select( "yoast-seo/editor" ).getSEMrushRequestResponse(),
			isSuccess: select( "yoast-seo/editor" ).getSEMrushRequestIsSuccess(),
			isPending: select( "yoast-seo/editor" ).getSEMrushIsRequestPending(),
			keyphraseLimitReached: select( "yoast-seo/editor" ).getSEMrushLimitReached(),
			requestHasData: select( "yoast-seo/editor" ).getSEMrushRequestHasData(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushChangeCountry,
			setSEMrushNewRequest,
			setSEMrushRequestSucceeded,
			setSEMrushRequestFailed,
			setSEMrushSetRequestLimitReached,
			addSEMrushKeyphrase,
			removeSEMrushKeyphrase,
			setSEMrushKeyphraseLimitReached,
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
			addRelatedKeyphrase: ( keyphrase ) => {
				addSEMrushKeyphrase( keyphrase );
			},
			removeRelatedKeyphrase: ( keyphrase ) => {
				removeSEMrushKeyphrase( keyphrase );
			},
			setKeyphraseLimitReached: () => {
				setSEMrushKeyphraseLimitReached();
			},
			setNoResultsFound: ( database, keyphrase ) => {
				setSEMrushNoResultsFound( database, keyphrase );
			},
		};
	} ),
] )( RelatedKeyphrasesModalContent );
