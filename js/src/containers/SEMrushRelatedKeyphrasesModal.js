import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import SEMrushRelatedKeyphrasesModal from "../components/SEMrushRelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getSEMrushModalOpen,
			getSEMrushLoginStatus,
		} = select( "yoast-seo/editor" );

		return {
			whichModalOpen: getSEMrushModalOpen(),
			isLoggedIn: getSEMrushLoginStatus(),
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
