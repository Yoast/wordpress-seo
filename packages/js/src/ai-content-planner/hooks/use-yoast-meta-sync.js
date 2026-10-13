import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Mirrors core/editor meta changes into yoast-seo/editor. Fires on every meta change,
 * including undo — which is intentional: undo should revert the Yoast fields too.
 * Direct sidebar edits (yoast-seo/editor only) will be overwritten if core/editor meta
 * changes afterwards — accepted trade-off for correct undo behaviour.
 *
 * @returns {void}
 */
export function useYoastMetaSync() {
	const { yoastTitle, yoastMetaDesc, yoastFocusKw, isPost, titleTemplate, descTemplate } = useSelect( select => {
		const editor = select( "core/editor" );
		const meta = editor.getEditedPostAttribute( "meta" );
		const { title, description } = select( "yoast-seo/editor" ).getSnippetEditorTemplates();
		return {
			yoastTitle: meta?._yoast_wpseo_title,
			yoastMetaDesc: meta?._yoast_wpseo_metadesc,
			yoastFocusKw: meta?._yoast_wpseo_focuskw,
			isPost: editor.getCurrentPostType() === "post",
			titleTemplate: title,
			descTemplate: description,
		};
	}, [] );
	const { updateData, setFocusKeyword } = useDispatch( "yoast-seo/editor" );

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
	}, [ isPost, yoastTitle, yoastMetaDesc, yoastFocusKw, titleTemplate, descTemplate ] );
}
