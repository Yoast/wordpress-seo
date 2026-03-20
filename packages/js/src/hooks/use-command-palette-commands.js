import { useCommand } from "@wordpress/commands";
import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Focuses a DOM element by ID after the sidebar/modal has rendered.
 *
 * Retries up to the specified number of animation frames to allow the React tree to mount.
 *
 * @param {string} elementId The DOM element ID to focus.
 * @param {number} [retries=5] Number of remaining retries.
 * @returns {void}
 */
function focusElementWithRetry( elementId, retries = 5 ) {
	requestAnimationFrame( () => {
		const input = document.getElementById( elementId );
		if ( input ) {
			input.focus();
			return;
		}
		if ( retries > 0 ) {
			focusElementWithRetry( elementId, retries - 1 );
		}
	} );
}

/**
 * Registers Yoast SEO commands in the WordPress command palette.
 *
 * Registers commands for setting the focus keyphrase, editing SEO title/description,
 * and editing social title/description. Each command opens the Yoast sidebar and
 * focuses the relevant input field, opening a modal when necessary.
 *
 * @param {Object} config Configuration object.
 * @param {boolean} config.isKeywordAnalysisActive Whether keyword analysis is enabled.
 * @param {boolean} config.useOpenGraphData Whether OpenGraph data is enabled.
 * @returns {void}
 */
const useCommandPaletteCommands = ( { isKeywordAnalysisActive, useOpenGraphData } ) => {
	const openGeneralSidebar = useDispatch( "core/edit-post" )?.openGeneralSidebar;
	const { openEditorModal } = useDispatch( "yoast-seo/editor" );

	const focusKeyphraseCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		focusElementWithRetry( "focus-keyword-input-sidebar" );
	}, [ openGeneralSidebar ] );

	const seoTitleCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		openEditorModal( "yoast-search-appearance-modal" );
		focusElementWithRetry( "yoast-google-preview-title-modal" );
	}, [ openGeneralSidebar, openEditorModal ] );

	const seoDescriptionCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		openEditorModal( "yoast-search-appearance-modal" );
		focusElementWithRetry( "yoast-google-preview-description-modal" );
	}, [ openGeneralSidebar, openEditorModal ] );

	const socialTitleCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		openEditorModal( "yoast-social-appearance-modal" );
		focusElementWithRetry( "social-title-input-modal" );
	}, [ openGeneralSidebar, openEditorModal ] );

	const socialDescriptionCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		openEditorModal( "yoast-social-appearance-modal" );
		focusElementWithRetry( "social-description-input-modal" );
	}, [ openGeneralSidebar, openEditorModal ] );

	const slugCallback = useCallback( ( { close } ) => {
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
		close();
		openEditorModal( "yoast-search-appearance-modal" );
		focusElementWithRetry( "yoast-google-preview-slug-modal" );
	}, [ openGeneralSidebar, openEditorModal ] );

	useCommand( {
		name: "yoast-seo/set-focus-keyphrase",
		label: __( "Yoast SEO: Set focus keyphrase", "wordpress-seo" ),
		callback: focusKeyphraseCallback,
		enabled: isKeywordAnalysisActive,
	} );

	useCommand( {
		name: "yoast-seo/edit-seo-title",
		label: __( "Yoast SEO: Edit SEO title", "wordpress-seo" ),
		callback: seoTitleCallback,
		enabled: isKeywordAnalysisActive,
	} );

	useCommand( {
		name: "yoast-seo/edit-seo-description",
		label: __( "Yoast SEO: Edit meta description", "wordpress-seo" ),
		callback: seoDescriptionCallback,
		enabled: isKeywordAnalysisActive,
	} );

	useCommand( {
		name: "yoast-seo/edit-social-title",
		label: __( "Yoast SEO: Edit social title", "wordpress-seo" ),
		callback: socialTitleCallback,
		enabled: useOpenGraphData,
	} );

	useCommand( {
		name: "yoast-seo/edit-social-description",
		label: __( "Yoast SEO: Edit social description", "wordpress-seo" ),
		callback: socialDescriptionCallback,
		enabled: useOpenGraphData,
	} );

	useCommand( {
		name: "yoast-seo/edit-slug",
		label: __( "Yoast SEO: Edit slug", "wordpress-seo" ),
		callback: slugCallback,
	} );
};

export default useCommandPaletteCommands;
