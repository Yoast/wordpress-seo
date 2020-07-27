import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		return {
			requestKeyphrase: select( "yoast-seo/editor" ).getSEMrushRequestKeyphrase(),
			whichModalOpen: select( "yoast-seo/editor" ).getSEMrushModalOpen(),
			currentDatabase: select( "yoast-seo/editor" ).getSEMrushSelectedCountry(),
			currentCountry: select( "yoast-seo/editor" ).getSEMrushRequestCountry(),
			OAuthToken: select( "yoast-seo/editor" ).getSEMrushRequestOAuthToken(),
			requestLimitReached: select( "yoast-seo/editor" ).getSEMrushRequestLimitReached(),
			response: select( "yoast-seo/editor" ).getSEMrushRequestResponse(),
			isSuccess: select( "yoast-seo/editor" ).getSEMrushRequestIsSuccess(),
			isPending: select( "yoast-seo/editor" ).getSEMrushIsRequestPending(),
			relatedKeyphrases: select( "yoast-seo/editor" ).getSEMrushKeyphrases(),
			keyphraseLimitReached: select( "yoast-seo/editor" ).getSEMrushLimitReached(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushNoKeyphraseMessage,
			setSEMrushOpenModal,
			setSEMrushDismissModal,
			setSEMrushChangeDatabase,
			setSEMrushNewRequest,
			setSEMrushRequestSucceeded,
			setSEMrushRequestFailed,
			setSEMrushSetRequestLimitReached,
			addSEMrushKeyphrase,
			removeSEMrushKeyphrase,
			setSEMrushKeyphraseLimitReached,
		} = dispatch(
			"yoast-seo/editor"
		);
		return {
			onOpenWitnNoKeyphrase: () => {
				setSEMrushNoKeyphraseMessage();
			},
			onOpen: ( location ) => {
				setSEMrushOpenModal( location );
			},
			onClose: () => {
				setSEMrushDismissModal();
			},
			setDatabase: ( country ) => {
				setSEMrushChangeDatabase( country );
			},
			newRequest: ( country, keyphrase, OAuthToken ) => {
				setSEMrushNewRequest( country, keyphrase, OAuthToken );
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
		};
	} ),
] )( RelatedKeyphrasesModal );
