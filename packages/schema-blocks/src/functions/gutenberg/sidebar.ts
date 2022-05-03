import { select, dispatch } from "@wordpress/data";

/**
 * Opens the given sidebar unless the given sidebar or another sidebar is already open.
 *
 * @param sidebarName The sidebar to open, default "yoast-seo/seo-sidebar".
 * @param forceOpen If true, closes the currently opened sidebar and opens the given sidebar, unless the current sidebar is the requested sidebar.
 */
export function openGeneralSidebar( sidebarName = "yoast-seo/seo-sidebar", forceOpen = false ): void {
	const isEditorSidebarClosed = select( "core/edit-post" ).isEditorSidebarOpened() === false;

	if ( forceOpen || isEditorSidebarClosed ) {
		const activeGeneralSidebarName = select( "core/edit-post" ).getActiveGeneralSidebarName();
		if ( activeGeneralSidebarName !== sidebarName ) {
			dispatch( "core/edit-post" ).openGeneralSidebar( sidebarName );
		}
	}
}
