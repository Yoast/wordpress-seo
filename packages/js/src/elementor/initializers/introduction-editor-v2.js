import { __ } from "@wordpress/i18n";

/**
 * Initializes the introduction.
 *
 * @returns {void}
 */
export default function initializeIntroductionEditorV2() {
	const INTRO_KEY = "yoast-introduction-editor-v2";
	const TARGET_SELECTOR = "button[data-tab='yoast-seo-tab']";

	// Skip if already viewed (truthy check).
	if ( window.elementor?.config?.user?.introduction?.[ INTRO_KEY ] ) {
		return;
	}

	const introduction = new window.elementorModules.editor.utils.Introduction( {
		introductionKey: INTRO_KEY,
		dialogType: "buttons",
		dialogOptions: {
			id: INTRO_KEY,
			className: "elementor-right-click-introduction yoast-elementor-introduction",
			headerMessage: __( "Yoast SEO for Elementor", "wordpress-seo" ),
			message: __( "Get started with Yoast SEO's content analysis for Elementor!", "wordpress-seo" ),
			// We will set `position.of` later when target exists.
			position: {
				my: "center top",
				at: "center bottom+20",
				autoRefresh: true,
				using( coords, feedback ) {
					// Arrow horizontal alignment:
					this.style.setProperty(
						"--yoast-elementor-introduction-arrow",
						feedback.target.left - feedback.element.left + 8 + "px"
					);

					// Vertical push below header if overlapping.
					const elementorHeader = feedback.target.element.closest( "#elementor-panel-inner header" );
					const headerHeight = elementorHeader ? elementorHeader.offsetHeight : 0;
					const arrowHeight = 12;

					if ( headerHeight && headerHeight > ( coords.top - arrowHeight ) ) {
						this.style.top = headerHeight + 20 + "px";
					} else {
						this.style.top = coords.top + "px";
					}

					this.style.left = coords.left + "px";
				},
			},
			hide: {
				onOutsideClick: false,
			},
		},
		onDialogInitCallback( dialog ) {
			// Auto-dismiss when a user actually opens the Yoast tab (optional).
			window.$e.routes.on( "run:after", ( component, route ) => {
				if ( route === "panel/elements/yoast-seo-tab" && ! introduction.introductionViewed ) {
					introduction.setViewed().finally( () => dialog.hide() );
				}
			} );

			dialog.addButton( {
				name: "ok",
				text: __( "Got it", "wordpress-seo" ),
				classes: "elementor-button elementor-button-success",
				callback: () => {
					introduction.setViewed().finally( () => dialog.hide() );
				},
			} );
		},
	} );

	function showIntroduction() {
		// Don't show if already viewed in the meantime.
		if ( introduction.introductionViewed ) {
			return;
		}

		const target = document.querySelector( TARGET_SELECTOR );

		if ( ! target ) {
			// Try again shortly until the tab button is rendered.
			setTimeout( showIntroduction, 120 );
			return;
		}

		// Update dialog position anchor just-in-time.
		introduction.getDialog().setSettings( "position", {
			...introduction.getDialog().getSettings( "position" ),
			of: target,
		} );

		introduction.show( target );
	}

	// Defer initial attempt to ensure panel DOM is present.
	setTimeout( showIntroduction, 200 );
}
