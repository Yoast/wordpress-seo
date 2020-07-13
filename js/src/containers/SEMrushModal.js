import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";


export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
			isModalOpen: select( "yoast-seo/editor" ).getSEMrushModalIsOpen(),
			currentDatabase: select( "yoast-seo/editor" ).getSEMrushSelectedCountry(),
			OAuthToken: "",
		}
	}),
	withDispatch( ( dispatch ) => {
		const { setSEMrushOpenModal, setSEMrushDismissModal, setSEMrushChangeDatabase } = dispatch(
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
		}
	}),
] )( RelatedKeyphrasesModal );


