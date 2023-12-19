import { select, subscribe, dispatch, use } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-site";
import { registerPlugin } from "@wordpress/plugins";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { TextControl } from "@wordpress/components";

const PLUGIN_TITLE = "Yoast SEO";

/**
 * Renders the yoast editor fills.
 *
 * @returns {Component} The editor fills component.
 */
const EditorFills = () => {
	const [ url, setUrl ] = useState( new URLSearchParams( window.location.search ) );
	const [ post, setPost ] = useState( {
		id: "",
		type: "",
	} );

	useEffect( () => {
		/**
		 * Handles the url change.
		 * @returns {void}
		 */
		const handleUrlChange = () => {
			const urlObj = new URLSearchParams( window.location.search );
			setUrl( urlObj );
		};

		window.addEventListener( "popstate", handleUrlChange );

		return () => {
			window.removeEventListener( "popstate", handleUrlChange );
		};
	}, [] );

	useEffect( () => {
		 setPost( {
			 id: url.get( "postId" ),
			 type: url.get( "postType" ),
		 } );
	}, [ url ] );

	 const subscribeToGetData = () => {
		if ( post.id && post.type ) {
			const data = select( "core" ).getEntityRecord( "postType", post.type, post.id );
			if ( data ) {
				setPost( data );
			}
		}
	 };

	 subscribe( subscribeToGetData );

	 const saveToStore = useCallback( ( content ) => {
		const { editEntityRecord } = dispatch( "core" );
		editEntityRecord( "postType", post.type, post.id, {
			meta: { _yoast_wpseo_focuskw: content } } );
	}, [ post ] );


	return <>
		<PluginSidebarMoreMenuItem target="seo-sidebar">
			{ PLUGIN_TITLE }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name="seo-sidebar"
			title={ PLUGIN_TITLE }
		>
			<TextControl
				label="Meta Block Field"
				defaultValue={ post?.meta?._yoast_wpseo_focuskw }
				onChange={ saveToStore }
			/>
		</PluginSidebar>
	</>;
};


domReady( () => {
	// TODO: find a way to listen to the editor switching to a post/page/whatever

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
