import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Mirrors core/editor meta changes into yoast-seo/editor. Fires on every meta change,
 * including undo — which is intentional: undo should revert the Yoast fields too.
 * Direct sidebar edits (yoast-seo/editor only) will be overwritten if core/editor meta
 * changes afterwards — accepted trade-off for correct undo behaviour.
 *
 * This hook is the core/editor → yoast-seo/editor direction. The reverse direction
 * (yoast-seo/editor → core/editor) is handled by the Redux action creators in
 * packages/js/src/redux/actions/ via the Fields helpers, which dispatch to core/editor
 * when wpseoScriptData.disableMetaboxInBlockEditor is true.
 *
 * @returns {void}
 */
export function useYoastMetaSync() {
	const { yoastTitle, yoastMetaDesc, yoastFocusKw, yoastIsCornerstone, isPost, titleTemplate, descTemplate } = useSelect( select => {
		const editor = select( "core/editor" );
		const meta = editor.getEditedPostAttribute( "meta" );
		const { title, description } = select( "yoast-seo/editor" ).getSnippetEditorTemplates();
		return {
			yoastTitle: meta?._yoast_wpseo_title,
			yoastMetaDesc: meta?._yoast_wpseo_metadesc,
			yoastFocusKw: meta?._yoast_wpseo_focuskw,
			yoastIsCornerstone: meta?._yoast_wpseo_is_cornerstone,
			isPost: editor.getCurrentPostType() === "post",
			titleTemplate: title,
			descTemplate: description,
		};
	}, [] );
	const { updateData, setFocusKeyword, setCornerstoneContent } = useDispatch( "yoast-seo/editor" );

	useEffect( () => {
		// These meta keys are only registered for the 'post' subtype; bail on all other post types
		// to avoid dispatching undefined values into yoast-seo/editor.
		if ( ! isPost ) {
			return;
		}
		// Only sync non-empty values. An empty string means no custom value has been saved, in
		// which case the snippet editor should keep showing the SEO title template instead of
		// being overwritten with an empty string.
		const dataToSync = {
			title: titleTemplate,
			description: descTemplate,
		};
		if ( yoastTitle ) {
			dataToSync.title = yoastTitle;
		}
		if ( yoastMetaDesc ) {
			dataToSync.description = yoastMetaDesc;
		}
		updateData( dataToSync );
		setFocusKeyword( yoastFocusKw || "" );
		setCornerstoneContent( yoastIsCornerstone === "1" );
	}, [ isPost, yoastTitle, yoastMetaDesc, yoastFocusKw, yoastIsCornerstone, titleTemplate, descTemplate ] );
}
