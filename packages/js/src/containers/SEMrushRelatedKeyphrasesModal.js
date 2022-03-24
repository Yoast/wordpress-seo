import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import SEMrushRelatedKeyphrasesModal from "../components/SEMrushRelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getSEMrushModalOpen,
			getSEMrushLoginStatus,
			getIsElementorEditor,
		} = select( "yoast-seo/editor" );

		return {
			whichModalOpen: getSEMrushModalOpen(),
			isLoggedIn: getSEMrushLoginStatus(),
			isElementorEditor: getIsElementorEditor(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushNoKeyphraseMessage,
			setSEMrushOpenModal,
			setSEMrushDismissModal,
			setSEMrushLoginStatus,
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
			onAuthentication: ( status ) => {
				setSEMrushLoginStatus( status );
			},
		};
	} ),
] )( SEMrushRelatedKeyphrasesModal );
