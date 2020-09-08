import { withSelect } from "@wordpress/data";
import SettingsModal from "../components/modals/SettingsModal";

export default withSelect( select => {
	const {
		getEditorContext,
	} = select( "yoast-seo/editor" );

	return {
		postTypeName: getEditorContext().postTypeNameSingular.toLowerCase(),
	};
} )( SettingsModal );
