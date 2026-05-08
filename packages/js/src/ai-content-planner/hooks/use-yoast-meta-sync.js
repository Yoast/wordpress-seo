import { dispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Mirrors core/editor meta changes into yoast-seo/editor. Fires on every meta change,
 * including undo — which is intentional: undo should revert the Yoast fields too.
 * Direct sidebar edits (yoast-seo/editor only) will be overwritten if core/editor meta
 * changes afterwards — accepted trade-off for correct undo behaviour.
 *
 * dispatch() is called inside the effect (not via useDispatch) because yoast-seo/editor
 * is registered after the Gutenberg store and may not be available at component mount;
 * resolving it lazily avoids the need for a conditional hook.
 *
 * @returns {void}
 */
export function useYoastMetaSync() {
	const { yoastTitle, yoastMetaDesc, yoastFocusKw } = useSelect( select => {
		const meta = select( "core/editor" ).getEditedPostAttribute( "meta" );
		return {
			yoastTitle: meta?._yoast_wpseo_title,
			yoastMetaDesc: meta?._yoast_wpseo_metadesc,
			yoastFocusKw: meta?._yoast_wpseo_focuskw,
		};
	}, [] );

	useEffect( () => {
		const yoastEditor = dispatch( "yoast-seo/editor" );
		yoastEditor?.updateData?.( { title: yoastTitle, description: yoastMetaDesc } );
		yoastEditor?.setFocusKeyword?.( yoastFocusKw );
	}, [ yoastTitle, yoastMetaDesc, yoastFocusKw ] );
}
