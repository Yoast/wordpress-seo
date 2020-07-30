import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		return {
			whichModalOpen: select( "yoast-seo/editor" ).getSEMrushModalOpen(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setSEMrushOpenModal, setSEMrushDismissModal } = dispatch(
			"yoast-seo/editor"
		);
		return {
			onOpen: ( location ) => {
				setSEMrushOpenModal( location );
			},
			onClose: () => {
				setSEMrushDismissModal();
			},
		};
	} ),
] )( RelatedKeyphrasesModal );
