/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

import EditorModal from "../components/modals/editorModals/EditorModal";

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			getPostOrPageString,
			getIsModalOpen,
		} = select( "yoast-seo/editor" );

		return {
			postTypeName: getPostOrPageString(),
			isOpen: getIsModalOpen( ownProps.id ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			openEditorModal,
			closeEditorModal,
		} = dispatch( "yoast-seo/editor" );

		return {
			open: () => openEditorModal( ownProps.id ),
			close: closeEditorModal,
		};
	} ),
] )( EditorModal );
