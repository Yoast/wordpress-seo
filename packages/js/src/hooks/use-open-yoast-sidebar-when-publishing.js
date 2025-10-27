import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";

/**
 * Custom hook to open the Yoast SEO sidebar from the Publish sidebar.
 *
 * @param {boolean} alsoOpenSearchAppearance Whether to also open the Search Appearance modal.
 *
 * @returns {Function} Function to open the Search Appearance modal.
 */
export const useOpenYoastSidebarWhenPublishing = ( alsoOpenSearchAppearance ) => {
	const openGeneralSidebar = useDispatch( "core/edit-post" )?.openGeneralSidebar;
	const closePublishSidebar = useDispatch( "core/editor" )?.closePublishSidebar;
	const { openEditorModal } = useDispatch( "yoast-seo/editor" );

	return useCallback(
		() => {
			closePublishSidebar();
			openGeneralSidebar( "yoast-seo/seo-sidebar" );
			if ( alsoOpenSearchAppearance ) {
				openEditorModal( "yoast-search-appearance-modal" );
			}
		},
		[ closePublishSidebar, openGeneralSidebar, openEditorModal ]
	);
};
