import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";
import {ADD_KEYPHRASE, REMOVE_KEYPHRASE, SET_KEYPHRASE_LIMIT_REACHED} from "../redux/actions";


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
			relatedKeyphrases: select( "yoast-seo/editor" ).getKeyphrases(),
			keyphraseLimitReached: select( "yoast-seo/editor" ).getLimitReached(),
		}
	}),
	withDispatch( ( dispatch ) => {
		const { setSEMrushOpenModal, setSEMrushDismissModal, setSEMrushChangeDatabase, setSEMrushNewRequest, setSEMrushRequestSucceeded, setSEMrushRequestFailed, setSEMrushSetRequestLimitReached, SEMrushAddKeyphrase, SEMrushRemoveKeyphrase, SEMrushSetKeyphraseLimitReached } = dispatch(
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
			requestSucceeded: ( response ) => {
				setSEMrushRequestSucceeded( response )
			},
			requestFailed: ( response ) => {
				setSEMrushRequestFailed( response )
			},
			setRequestLimitReached: () => {
				setSEMrushSetRequestLimitReached()
			},
			addRelatedKeyphrase: ( keyphrase ) => {
				SEMrushAddKeyphrase( keyphrase )
			},
			removeRelatedKeyphrase: ( keyphrase ) => {
				SEMrushRemoveKeyphrase( keyphrase )
			},
			setKeyphraseLimitReached: () => {
				SEMrushSetKeyphraseLimitReached()
			},
		}
	}),
] )( RelatedKeyphrasesModal );
