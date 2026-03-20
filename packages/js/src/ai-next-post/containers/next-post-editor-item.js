import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { count } from "@wordpress/wordcount";
import { NextPostEditorItem } from "../components/next-post-editor-item";

export default compose( [
	withSelect( select => {
		const content = select( "core/editor" ).getEditedPostContent();

		return {
			isPremium: select( "yoast-seo/editor" ).getIsPremium(),
			isEmptyCanvas: count( content, "words", {} ) === 0,
		};
	} ),
] )( NextPostEditorItem );
