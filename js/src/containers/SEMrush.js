import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";


export default compose( [
	withSelect( ( select ) => {
		return {
			isModalOpen: select( "yoast-seo/editor" ).getSEMrushModalIsOpen(),
			currentDatabase: select( "yoast-seo/editor" ).getSEMrushSelectedCountry(),
			currentCountry: select( "yoast-seo/editor" ).getRequestCountry(),
			OAuthToken: select( "yoast-seo/editor" ).getRequestOAuthToken(),
			limitReached: select( "yoast-seo/editor" ).getRequestLimitReached(),
			response: select( "yoast-seo/editor" ).getRequestResponse(),
			isSuccess: select( "yoast-seo/editor" ).getRequestIsSuccess(),
			isPending: select( "yoast-seo/editor" ).getIsRequestPending(),
		}
	}),
	withDispatch( ( dispatch ) => {
		const { setSEMrushOpenModal, setSEMrushDismissModal, setSEMrushChangeDatabase, setSEMrushNewRequest, setSEMrushRequestSucceeded, setSEMrushRequestFailed, setSEMrushSetRequestLimitReached } = dispatch(
			"yoast-seo/editor"
		);
		return {
			onOpen: () => {
				setSEMrushOpenModal()
			},
			onClose: () => {
				setSEMrushDismissModal()
			},
			setDatabase: ( country ) => {
				setSEMrushChangeDatabase( country )
			},
			newRequest: ( country, keyphrase, OAuthToken ) => {
				setSEMrushNewRequest( country, keyphrase, OAuthToken )
			},
			requestSucceeded: () => {
				setSEMrushRequestSucceeded( response )
			},
			requestFailed: () => {
				setSEMrushRequestFailed( response )
			},
			setLimitReached: ( country ) => {
				setSEMrushSetRequestLimitReached()
			},
		}
	}),
] )( RelatedKeyphrasesModal );


