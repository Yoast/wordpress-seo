import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createPortal, useState } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";
import { Root } from "@yoast/externals/contexts";
import { debounce } from "lodash";
import ElementorSlot from "../elementor/components/slots/ElementorSlot";
import ElementorFill from "../elementor/containers/ElementorFill";
import { registerElementorDataHookAfter } from "../helpers/elementorHook";
import { registerReactComponent, renderReactRoot } from "../helpers/reactRoot";
import { useMutationObserver } from "../hooks/use-mutation-observer";

const TAB_ID = "yoast-elementor-react-tab";

// Keep track of unsaved SEO setting changes.
let hasUnsavedSeoChanges = false;
let yoastInputs;

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
function activateSaveButton() {
	window.$e.internal( "document/save/set-is-modified", { status: true } );
}

/**
 * Copies the current value to the oldValue.
 *
 * @param {HTMLElement} input The input element.
 *
 * @returns {void}
 */
function storeValueAsOldValue( input ) {
	input.oldValue = input.value;
}

/**
 * Copies the current value to the oldValue for all Yoast inputs.
 *
 * @returns {void}
 */
function storeAllValuesAsOldValues() {
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );
}

/**
 * Updates the save warning message.
 *
 * @returns {void}
 */
function updateSaveAsDraftWarning() {
	let message;

	if ( hasUnsavedSeoChanges ) {
		/* Translators: %1$s translates to the Post Label in singular form */
		message = sprintf( __(
			// eslint-disable-next-line max-len
			"Unfortunately we cannot save changes to your SEO settings while you are working on a draft of an already-published %1$s. If you want to save your SEO changes, make sure to click 'Update', or wait to make your SEO changes until you are ready to update the %1$s.",
			"wordpress-seo"
		), window.wpseoAdminL10n.postTypeNameSingular.toLowerCase() );
	}

	// Don't show the warning for drafts.
	if ( window.elementor.settings.page.model.get( "post_status" ) === "draft" ) {
		message = "";
	}

	dispatch( "yoast-seo/editor" ).setWarningMessage( message );
}

/**
 * Wraps the updateSaveAsDraftWarning in a trailing debounce.
 *
 * We have our save AFTER Elementor's save.
 * Therefore, the post status is changed before our SEO settings.
 * Resulting in a flickering Warning after publishing.
 * This trailing debounce prevents that.
 */
const debouncedUpdateSaveAsDraftWarning = debounce( updateSaveAsDraftWarning, 500, { trailing: true } );

/**
 * Initializes the post status change listener.
 *
 * @returns {void}
 */
function initializePostStatusListener() {
	window.elementor.settings.page.model.on( "change", model => {
		if ( model.changed && model.changed.post_status ) {
			// The post status has changed: update our warning.
			debouncedUpdateSaveAsDraftWarning();
		}
	} );
}

/**
 * Checks if field is in the skip list.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {boolean} true if input is field that should be skipped.
 */
function isSkipField( input ) {
	// SEO fields that  do not require a new save.
	const skipFields = [
		"yoast_wpseo_linkdex",
		"yoast_wpseo_content_score",
		"yoast_wpseo_inclusive_language_score",
		"yoast_wpseo_words_for_linking",
		"yoast_wpseo_estimated-reading-time-minutes",
	];

	return skipFields.includes( input.name );
}

/**
 * Checks if field is keyword field.
 *
 * @param {string} name the input name.
 *
 * @returns {boolean} true if input is keyword field.
 */
function isKeywordField( name ) {
	const keywordsFields = [
		"yoast_wpseo_focuskeywords",
		"hidden_wpseo_focuskeywords",
	];

	return keywordsFields.includes( name );
}

/**
 * Detects if keyword field value is not changed.
 *
 * @param {string} oldValue the input old value.
 * @param {string} newValue the input new value.
 *
 * @returns {boolean} true if keyword field value is not changed.
 */
function isKeywordValueUnchanged( oldValue, newValue ) {
	if ( newValue === oldValue ) {
		return true;
	}

	if ( newValue === "" || oldValue === "" ) {
		return false;
	}

	const newValueJson = JSON.parse( newValue );
	const oldValueJson = JSON.parse( oldValue );

	if ( newValueJson.length !== oldValueJson.length ) {
		return false;
	}

	// Check only input value and skip calculated.
	return newValueJson.every( ( v, index ) => v.keyword === oldValueJson[ index ].keyword );
}

/**
 * Activates the save button if a change is detected.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {void}
 */
function detectChange( input ) {
	if ( isSkipField( input ) ) {
		return;
	}

	if ( isKeywordField( input.name ) && isKeywordValueUnchanged( input.oldValue, input.value ) ) {
		return;
	}

	if ( input.value !== input.oldValue ) {
		hasUnsavedSeoChanges = true;
		debouncedUpdateSaveAsDraftWarning();
		activateSaveButton();
		storeValueAsOldValue( input );
	}
}


/**
 * Saves the form via AJAX action.
 *
 * @param {HTMLElement} form The form to submit.
 *
 * @returns {void}
 */
function sendFormData( form ) {
	// Assume the save will be successful, to prevent a flashing warning due to the post status listener.
	hasUnsavedSeoChanges = false;

	const data = jQuery( form ).serializeArray().reduce( ( result, { name, value } ) => {
		result[ name ] = value;

		return result;
	}, {} );

	jQuery.post( form.getAttribute( "action" ), data, ( { success, data: responseData }, status, xhr ) => {
		if ( ! success ) {
			// Revert false assumption, see above.
			hasUnsavedSeoChanges = true;

			// Something went wrong while saving.
			return;
		}

		doAction( "yoast.elementor.save.success", xhr );

		// Update the slug in our store if WP changed it.
		if ( responseData.slug && responseData.slug !== data.slug ) {
			dispatch( "yoast-seo/editor" ).updateData( { slug: responseData.slug } );
		}

		// Save the current SEO values as old values because we just saved them.
		storeAllValuesAsOldValues();

		// Update the save as draft warning.
		debouncedUpdateSaveAsDraftWarning();
	} );
}

/**
 * Renders the content in a portal if the element exists.
 *
 * The portal is created once the element is detected.
 * The portal is removed once the element is removed.
 *
 * @param {string} id The ID of the element to render in.
 * @param {JSX.node} children The content.
 *
 * @returns {JSX.node|null} The rendered content or null.
 */
const RenderInPortalIfElementExists = ( { id, children } ) => {
	const [ render, setRender ] = useState( null );

	useMutationObserver( document.body, () => {
		const el = document.getElementById( id );
		if ( el ) {
			if ( render === null ) {
				setRender( createPortal( children, el ) );
			}
		} else if ( render !== null ) {
			setRender( null );
		}
	} );

	return render;
};

/**
 * Renders the Yoast tab React content.
 * @returns {void}
 */
const renderYoastTabReactContent = () => {
	// Get the current tab/controls.
	const root = document.getElementById( "elementor-panel-page-settings-controls" );
	if ( ! root ) {
		return;
	}

	// Hide the Elementor control, we just fill the full contents of the tab.
	const control = root.getElementsByClassName( "elementor-control" )?.[ 0 ];
	if ( control ) {
		control.style.display = "none";
	}

	// Create our Yoast tab inside, being picked up by the MutationObserver of RenderInPortalIfElementExists.
	const element = document.createElement( "div" );
	element.id = TAB_ID;
	element.className = "yoast yoast-elementor-panel__fills";
	root.appendChild( element );
};

/**
 * Renders the Yoast React root.
 * @returns {void}
 */
const renderYoastReactRoot = () => {
	const elementorSidebarContext = { locationContext: "elementor-sidebar" };
	const root = document.createElement( "div" );
	root.id = "yoast-elementor-react-root";
	document.body.appendChild( root );

	renderReactRoot( root.id, (
		<Root context={ elementorSidebarContext }>
			<RenderInPortalIfElementExists id={ TAB_ID }>
				<ElementorSlot />
				<ElementorFill />
			</RenderInPortalIfElementExists>
		</Root>
	) );
};

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration() {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

	domReady( renderYoastReactRoot );
	initializePostStatusListener();

	// Hook into the save.
	const handleSave = sendFormData.bind( null, document.getElementById( "yoast-form" ) );
	registerElementorDataHookAfter( "document/save/save", "yoast-seo-save", () => {
		/**
		 * Do not save our data to a revision.
		 *
		 * WordPress saves the metadata to the post parent, not the revision. See `update_post_meta`.
		 * Most likely this is because saving a revision on a published post will unpublish in WordPress itself.
		 * But Elementor does not unpublish your post when you save a draft.
		 * This would result in Yoast SEO data being live while saving a draft.
		 */
		if ( window.elementor.config.document.id === window.elementor.config.document.revisions.current_id ) {
			handleSave();
		}
	} );

	// Register with the menu.
	const menu = window.elementor.modules.layouts.panel.pages.menu.Menu;
	menu.addItem( {
		name: "yoast",
		icon: "yoast yoast-element-menu-icon",
		title: "Yoast SEO",
		type: "page",
		callback: () => {
			try {
				window.$e.route( "panel/page-settings/yoast-tab" );
			} catch ( error ) {
				// The yoast tab is only available if the page settings has been visited.
				window.$e.route( "panel/page-settings/settings" );
				window.$e.route( "panel/page-settings/yoast-tab" );
			}
			// Start rendering the Yoast tab React content.
			renderYoastTabReactContent();
		},
	}, "more" );

	/*
	 * Listen for Yoast tab activation from within settings panel to start rendering the Yoast tab React content.
	 * Note the `.not` in the selector, this is to prevent rendering the React content multiple times.
	 */
	jQuery( document )
		.on( "click", "[data-tab=\"yoast-tab\"]:not(.elementor-active)", renderYoastTabReactContent )
		.on( "keyup", "[data-tab=\"yoast-tab\"]:not(.elementor-active)", ( event ) => {
			const ENTER_KEY = 13;
			const SPACE_KEY = 32;

			if ( ENTER_KEY === event.keyCode || SPACE_KEY === event.keyCode ) {
				event.currentTarget.click();
			}
		} );

	yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	storeAllValuesAsOldValues();

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}

