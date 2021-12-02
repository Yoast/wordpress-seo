import jQuery from "jquery";

const AioseoV4 = 'WPSEO_Import_AIOSEO_V4';

let importButton, importForm;

/**
 * Watches the Import form.
 *
 * @returns {void}
 */
function watchImportForm() {
	importButton = jQuery( "[name='import_external']" );
	importForm = jQuery( importButton ).parents( "form:first" );
	
	if ( importForm ) {
		importForm.on( "submit", handleImportFormSubmission );
	}
}


/**
 * Handles the import form submission and calls the new import endpoints if necessary.
 *
 * @param {JQuery.Event} event The submission event.
 *
 * @returns {void}
 */
function handleImportFormSubmission( event ) {
	let dropdown = jQuery( "[name='import_external_plugin']" );

	if ( dropdown.val() === AioseoV4 ) {
		event.preventDefault();

		//@todo: Call the new import endpoints.
		console.log( "Call the new import endpoints" );

		return;
	}
}

jQuery( function() {
	watchImportForm();
} );
