import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { count } from "@wordpress/wordcount";
import { ContentPlannerEditorItem } from "../components/content-planner-editor-item";

export default compose( [
	withSelect( select => {
		const content = select( "core/editor" ).getEditedPostContent();

		return {
			isPremium: select( "yoast-seo/editor" ).getIsPremium(),
			isEmptyCanvas: count( content, "words", {} ) === 0,
			upsellLink: select( "yoast-seo/editor" ).selectLink( "https://yoa.st/content-planner-approve-modal" ),
		};
	} ),
] )( ContentPlannerEditorItem );
