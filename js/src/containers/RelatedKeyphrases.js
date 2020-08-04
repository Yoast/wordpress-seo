/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import RelatedKeyphraseModalContent from "../components/RelatedKeyphraseModalContent";

export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
			currentDatabase: select( "yoast-seo/editor" ).getSEMrushSelectedDatabase(),
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
			setSEMrushChangeDatabase,
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
			setDatabase: ( database ) => {
				setSEMrushChangeDatabase( database );
			},
			newRequest: ( database, keyphrase ) => {
				setSEMrushNewRequest( database, keyphrase );
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
] )( RelatedKeyphraseModalContent );
