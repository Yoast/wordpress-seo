import { withSelect } from "@wordpress/data";
import EditorModal from "../components/modals/editorModals/EditorModal";

export default withSelect( select => {
	const {
		getPostOrPageString,
	} = select( "yoast-seo/editor" );

	return {
		postTypeName: getPostOrPageString(),
	};
} )( EditorModal );
