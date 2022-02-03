import jQuery from "jquery";

import IndexingService from "./services/IndexingService";

const AioseoV4 = "WPSEO_Import_AIOSEO_V4";

let cleanupButton, cleanupDropdown, cleanupForm,
	importButton, importDropdown, importForm,
	spinner, loadingMessageCleanup, loadingMessageImport, checkMark,
	cleanupExplanation, importExplanation;

/**
 * Adds Progress UI elements in the page.
 *
 * @returns {void}
 */
function addProgressElements() {
	jQuery( checkMark ).insertAfter( [ importButton, cleanupButton ] );
	jQuery( loadingMessageImport ).insertAfter( importButton );
	jQuery( loadingMessageCleanup ).insertAfter( cleanupButton );
	jQuery( spinner ).insertAfter( [ importButton, cleanupButton ] );
}

/**
 * Function called when importing/cleanup progress is made.
 *
 * @param {bool} isImport Whether it's an import.
 *
 * @returns {void}
 */
function showProgress( isImport ) {
	var actingForm = cleanupForm;
	var loadingMessage = loadingMessageCleanup;
	var actingButton = cleanupButton;

	if ( isImport ) {
		actingForm = importForm;
		loadingMessage = loadingMessageImport;
		actingButton = importButton;
	}

	actingForm.children( ".yoast-import-spinner" ).show();
	loadingMessage.show();
	actingForm.closest( "div" ).find( ".yoast-import-failure" ).remove();

	actingButton.prop( "disabled", true );
}

/**
 * Function called when importing progress is made.
 *
 * @param {number} count The amount of items processed.
 *
 * @returns {void}
 */
function importingProgress( count ) { // eslint-disable-line no-unused-vars
	showProgress( true );
}

/**
 * Function called when cleanup progress is made.
 *
 * @param {number} count The amount of items processed.
 *
 * @returns {void}
 */
function cleanupProgress( count ) { // eslint-disable-line no-unused-vars
	showProgress( false );
}

/**
 * Function called when importing/cleanup is completed succesfully.
 *
 * @param {bool} isImport Whether it's an import.
 *
 * @returns {void}
 */
function showSuccess( isImport ) {
	var actingForm = cleanupForm;
	var loadingMessage = loadingMessageCleanup;
	var actingButton = cleanupButton;
	var actingDropdown = cleanupDropdown;

	if ( isImport ) {
		actingForm = importForm;
		loadingMessage = loadingMessageImport;
		actingButton = importButton;
		actingDropdown = importDropdown;
	}

	actingForm.children( ".yoast-import-spinner" ).hide();
	loadingMessage.hide();
	actingForm.children( ".yoast-import-success-mark" ).show();
	actingForm.closest( "div" ).find( ".yoast-import-failure" ).remove();

	actingButton.prop( "disabled", false );

	// Remove the plugin that we just finished import for, from the import dropdown.
	jQuery( "option:selected", actingDropdown ).remove();
	jQuery( "option[value='']", actingDropdown ).prop( "selected", true );
	actingDropdown.trigger( "change" );

	// Dropdown will always have at least one option aka the placeholder, so let's check if it has any more options before displaying the no_data_msg.
	if ( actingDropdown.children( "option" ).length < 2 ) {
		actingDropdown.prop( "disabled", true );
		actingForm.after( jQuery( "<p></p>" ).text( window.yoastImportData.assets.no_data_msg ) );
	}
}

/**
 * Function called when import is completed succesfully.
 *
 * @returns {void}
 */
function importingSuccess() {
	showSuccess( true );
}

/**
 * Function called when cleanup is completed succesfully.
 *
 * @returns {void}
 */
function cleanupSuccess() {
	showSuccess( false );
}

/**
 * Function called when importing/cleanup is completed succesfully.
 *
 * @param {string} e The failure string.
 * @param {bool} isImport Whether it's an import.
 *
 * @returns {void}
 */
function showFailure( e, isImport ) {
	var actingForm = cleanupForm;
	var loadingMessage = loadingMessageCleanup;
	var actingButton = cleanupButton;
	var failureMessage = window.yoastImportData.assets.cleanup_failure;

	if ( isImport ) {
		actingForm = importForm;
		loadingMessage = loadingMessageImport;
		actingButton = importButton;
		failureMessage = window.yoastImportData.assets.import_failure;
	}

	actingForm.children( ".yoast-import-spinner" ).hide();
	loadingMessage.hide();

	actingButton.prop( "disabled", false );

	// Add a failure alert too.
	var failureAlert = jQuery( "<div>" )
		.addClass( "yoast-measure yoast-import-failure" )
		.html( failureMessage.replace( /%s/g, "<strong>" + e + "</strong>" ) );

	actingForm.after( failureAlert );
}

/**
 * Function called when importing is completed succesfully.
 *
 * @param {string} e The failure string.
 *
 * @returns {void}
 */
function importingFailure( e ) {
	showFailure( e, true );
}

/**
 * Function called when cleanup is completed succesfully.
 *
 * @param {string} e The failure string.
 *
 * @returns {void}
 */
function cleanupFailure( e ) {
	showFailure( e, false );
}

/**
 * Handles the import form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleImportFormSubmission( event ) {
	if ( importDropdown.val() === AioseoV4 ) {
		// Do not actually submit the form.
		event.preventDefault();

		const indexingService = new IndexingService( window.yoastImportData );

		indexingService.index( window.yoastImportData.restApi.importing_endpoints.aioseo, importingProgress )
			.then( importingSuccess )
			.catch( importingFailure );
	}
}

/**
 * Handles the cleanup form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleCleanupFormSubmission( event ) {
	if ( cleanupDropdown.val() === AioseoV4 ) {
		// Do not actually submit the form.
		event.preventDefault();

		const indexingService = new IndexingService( window.yoastImportData );

		indexingService.index( window.yoastImportData.restApi.cleanup_endpoints.aioseo, cleanupProgress )
			.then( cleanupSuccess )
			.catch( cleanupFailure );
	}
}

/**
 * Initialize elements.
 *
 * @returns {void}
 */
function initElements() {
	cleanupButton = jQuery( "[name='clean_external']" );
	cleanupButton.val( window.yoastImportData.assets.replacing_texts.cleanup_button );
	cleanupDropdown = jQuery( "[name='clean_external_plugin']" );
	cleanupForm = jQuery( cleanupButton ).parents( "form:first" );
	importButton = jQuery( "[name='import_external']" );
	importDropdown = jQuery( "[name='import_external_plugin']" );
	importForm = jQuery( importButton ).parents( "form:first" );
	importForm.after( jQuery( "<p></p>" )
		.html( "<strong>" + window.yoastImportData.assets.note + "</strong>" + window.yoastImportData.assets.cleanup_after_import_msg ) );
	spinner = jQuery( "<img>" )
		.addClass( "yoast-import-spinner" )
		.attr( "src", window.yoastImportData.assets.spinner )
		.css( {
			display: "inline-block",
			"margin-left": "10px",
			"vertical-align": "middle",
		} )
		.hide();
	loadingMessageImport = jQuery( "<span>" )
		.html( window.yoastImportData.assets.loading_msg_import )
		.css( {
			"margin-left": "5px",
			"vertical-align": "middle",
		} )
		.hide();
	loadingMessageCleanup = jQuery( "<span>" )
		.html( window.yoastImportData.assets.loading_msg_cleanup )
		.css( {
			"margin-left": "5px",
			"vertical-align": "middle",
		} )
		.hide();
	checkMark = jQuery( "<span>" )
		.addClass( "dashicons dashicons-yes-alt yoast-import-success-mark" )
		.css( {
			"margin-left": "10px",
			"vertical-align": "middle",
			color: "green",
		} )
		.hide();
	importExplanation = jQuery( ".yoast-import-explanation" );
	importExplanation.html( window.yoastImportData.assets.replacing_texts.import_explanation );
	cleanupExplanation = jQuery( ".yoast-cleanup-explanation" );
	cleanupExplanation.html( window.yoastImportData.assets.replacing_texts.cleanup_explanation );
}

/**
 * Watches the import/cleanup selects.
 *
 * @param {element} dropdown The dropdown to watch.
 *
 * @returns {void}
 */
function watchSelect( dropdown ) {
	var button = dropdown.closest( "form" ).find( "input[type=submit]" );
	var selectedPlugin, text, textSource;

	dropdown.on( "change", function() {
		selectedPlugin = jQuery( this ).find( "option:selected" ).attr( "value" );

		// Disable the Import button if no button is selected.
		if ( selectedPlugin === "" ) {
			button.prop( "disabled", true );
			return;
		}
		button.prop( "disabled", false );

		// Display the relevant text depending on which plugin is selected for import.
		if ( dropdown === importDropdown ) {
			text = window.yoastImportData.assets.replacing_texts.select_header.replace( /%s/g, jQuery( this ).find( "option:selected" ).text() );
			if ( selectedPlugin === AioseoV4 ) {
				textSource = window.yoastImportData.assets.replacing_texts.plugins.aioseo;
			} else {
				textSource = window.yoastImportData.assets.replacing_texts.plugins.other;
			}
			text += "<ul style='list-style: disc; padding: 0 15px;'>";
			textSource.forEach( function( dataItem ) {
				text += "<li>" + dataItem.data_name + "<br/><i>" + dataItem.data_note + "</i></li>";
			} );
			text += "</ul>";

			importExplanation.html( text );
		}
	} );
}

/**
 * Prepares the import and cleanup selects.
 *
 * @returns {void}
 */
function prepareSelects() {
	if ( importDropdown ) {
		watchSelect( importDropdown );

		importDropdown.append(
			"<option value='' disabled='disabled' selected hidden>&mdash; " + window.yoastImportData.assets.select_placeholder + " &mdash;</option>"
		).trigger( "change" );
	}

	if ( cleanupDropdown ) {
		watchSelect( cleanupDropdown );

		cleanupDropdown.append(
			"<option value='' disabled='disabled' selected hidden>&mdash; " + window.yoastImportData.assets.select_placeholder + " &mdash;</option>"
		).trigger( "change" );
	}
}

/**
 * Watches the `Import` form.
 *
 * @returns {void}
 */
function watchImportForm() {
	if ( importForm ) {
		importForm.on( "submit", handleImportFormSubmission );
	}
}

/**
 * Watches the `Clean Up` form.
 *
 * @returns {void}
 */
function watchCleanupForm() {
	if ( cleanupForm ) {
		cleanupForm.on( "submit", handleCleanupFormSubmission );
	}
}

jQuery( function() {
	initElements();
	prepareSelects();
	watchImportForm();
	watchCleanupForm();
	addProgressElements();
} );
