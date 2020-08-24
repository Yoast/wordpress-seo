import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import SEMrushRelatedKeyphrasesModal from "../components/SEMrushRelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		return {
			whichModalOpen: select( "yoast-seo/editor" ).getSEMrushModalOpen(),
			isLoggedIn: select( "yoast-seo/editor" ).getSEMrushLoginStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushNoKeyphraseMessage,
			setSEMrushOpenModal,
			setSEMrushDismissModal,
		} = dispatch( "yoast-seo/editor" );

		return {
			onOpenWithNoKeyphrase: () => {
				setSEMrushNoKeyphraseMessage();
			},
			onOpen: ( location ) => {
				setSEMrushOpenModal( location );
			},
			onClose: () => {
				setSEMrushDismissModal();
			},
		};
	} ),
] )( SEMrushRelatedKeyphrasesModal );
