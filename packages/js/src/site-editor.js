import domReady from "@wordpress/dom-ready";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-site";
import { registerPlugin } from "@wordpress/plugins";

const PLUGIN_TITLE = "Yoast SEO";

/**
 * Renders the yoast editor fills.
 *
 * @returns {Component} The editor fills component.
 */
const EditorFills = () => (
	<>
		<PluginSidebarMoreMenuItem target="seo-sidebar">
			{ PLUGIN_TITLE }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name="seo-sidebar"
			title={ PLUGIN_TITLE }
		/>
	</>
);

domReady( () => {
	// TODO: find a way to listen to the editor switching to a post/page/whatever
	//
	//	const postId = select( "core/edit-site" ).getEditedPostContext().postId;
	//	window.yoast = window.yoast || {};
	//
	//	// window.yoast.EditorData = BlockEditorData;
	//	console.log( postId );

	// window.YoastSEO.store = initEditorStore();

	registerPlugin( "yoast-seo", {
		//		render: () => {
		//			return (
		//				<Fill name="PinnedItems/core/edit-site">
		//					<h2>TESTING 123</h2>
		//				</Fill>
		//			);
		//		},
		render: EditorFills,
	} );
} );
