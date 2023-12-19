/* eslint-disable no-unused-vars */
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import BlockEditorData from "./analysis/blockEditorData";
import { TextControl } from "@wordpress/components";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-post";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";

// window.yoast = window.yoast || {};
// window.yoast.initEditorIntegration = initBlockEditorIntegration;
// window.yoast.EditorData = BlockEditorData;
/* eslint-enable no-unused-vars */

// eslint-disable-next-line require-jsdoc
// const MetaBlockField = () => {
// 	const [ meta, setMeta ] = useEntityProp( "postType", "post", "meta" );
// 	const { editPost } = useDispatch( "core/editor" );
// 	const saveValue = ( content ) => {
// 		// setMeta( {
// 		// 	...meta,
// 		// 	_yoast_wpseo_focuskw: content,
// 		// } );
// 		editPost( {
// 			meta: { _yoast_wpseo_focuskw: content },
// 		} );
// 	};

// 	return <TextControl
// 		label="Meta Block Field"
// 		defaultValue={ meta._yoast_wpseo_focuskw }
// 		onChange={ content => saveValue( content ) }
// 	/>;
// };

// registerPlugin( "my-plugin-sidebar", {
// 	render: () => (
// 		<PluginSidebar
// 			name="my-plugin-sidebar"
// 			icon="admin-post"
// 			title="My plugin sidebar"
// 		>
// 			<div className="plugin-sidebar-content">
// 				<MetaBlockField />
// 			</div>
// 		</PluginSidebar>
// 	),
// } );
