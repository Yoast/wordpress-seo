import PostSettingsModal from "../components/modals/PostSettingsModal";
import { withSelect } from "@wordpress/data";

/**
 * Return the singular post type name of the current post.
 *
 * Only differentiates between posts and pages since all CPT should display post as well.
 *
 * @param {string} postTypeNameSingular The singular name of the post type.
 *
 * @returns {string} Either page for pages or post for all other types.
 */
const getPostTypeName = ( postTypeNameSingular ) => {
	const postTypeName = postTypeNameSingular.toLowerCase();
	if ( postTypeName === "page" ) {
		return postTypeName;
	}

	return "post";
};

export default withSelect( select => {
	const {
		getPreferences,
		getEditorContext,
	} = select( "yoast-seo/editor" );

	const preferences = getPreferences();

	return {
		preferences,
		postTypeName: getPostTypeName( getEditorContext().postTypeNameSingular ),
	};
} )( PostSettingsModal );
