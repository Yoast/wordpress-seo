import { __ } from "@wordpress/i18n";

/**
 * Initializes the introduction.
 *
 * @returns {void}
 */
export default function initializeIntroductionEditorV2() {
	const INTRO_KEY = "yoast-introduction-editor-v2";
	const TARGET_SELECTOR = "button[data-tab='yoast-seo-tab']";

	// Don't show the introduction if already viewed.
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
			// We will set `position.of` later when the target exists.
			position: {
				my: "center top",
				at: "center bottom+12",
				autoRefresh: true,
				using( coords, feedback ) {
					// Arrow horizontal alignment:
					// Center the arrow on the target button by accounting for half the target width
					// and subtracting half the arrow width (8px border-width)
					const arrowOffset = feedback.target.left - feedback.element.left + ( feedback.target.width / 2 ) - 8;
					this.style.setProperty(
						"--yoast-elementor-introduction-arrow",
						arrowOffset + "px"
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
			// Auto-dismiss when a user actually opens the Yoast tab.
			window.$e.routes.on( "run:after", ( component, route ) => {
				if ( ! introduction.introductionViewed ) {
					// Auto-dismiss when the user opens the Yoast SEO tab or when leaving the Elements panel.
					if ( route === "panel/elements/yoast-seo-tab" || ! route.startsWith( "panel/elements" ) ) {
						// Hide immediately to prevent delay, then mark as viewed in background.
						dialog.hide();
						introduction.setViewed();
					}
				}
			} );

			// Auto-dismiss when switching to preview mode, and the Elements panel is hidden.
			window.elementor.channels.dataEditMode.on( "switch", ( activeMode ) => {
				// If switched to preview mode, hide the introduction.
				if ( activeMode === "preview" && ! introduction.introductionViewed ) {
					dialog.hide();
					introduction.setViewed();
				}
			} );

			dialog.addButton( {
				name: "ok",
				text: __( "Got it", "wordpress-seo" ),
				classes: "elementor-button elementor-button-success",
				callback: () => {
					dialog.hide();
					introduction.setViewed();
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
			setTimeout( showIntroduction, 100 );
			return;
		}

		// Update dialog position anchor just-in-time.
		introduction.getDialog().setSettings( "position", {
			...introduction.getDialog().getSettings( "position" ),
			of: target,
		} );

		introduction.show( target );
	}

	// Defer the initial attempt to ensure panel DOM is present.
	setTimeout( showIntroduction, 100 );
}
