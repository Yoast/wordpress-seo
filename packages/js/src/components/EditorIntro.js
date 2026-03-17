import { ReactComponent as YoastIcon } from "../../images/yoast.svg";
import { __ } from "@wordpress/i18n";

/**
 *
 * @param {boolean} isBlockEditor Whether the block editor is active.
 * @param {boolean} isPost Whether the current post type is a post.
 * @returns {JSX.Element} The editor introduction component.
 */
export const EditorIntro = ( { isBlockEditor, isPost } ) => {
	return <div className="yst-px-4 yst-pt-4">
		<YoastIcon />
		<p className="yst-text-slate-600 yst-mb-0 yst-mt-3">
			{ isBlockEditor && isPost ? __( "Optimize your content for discovery or get new content suggestions.", "wordpress-seo" )
				: __( "Optimize your content for discovery.", "wordpress-seo" ) }
		</p>
	</div>;
};
