/**
 * Get the editor created via wp_editor() and append it to the term-description-wrap
 * table cell. This way we can use the wp tinyMCE editor on the description field.
 *
 * @param {Object} jQuery The jQuery object.
 * @param {{ isTerm: boolean }} options Options object specifying if current page is a term.
 * @returns {void}
 */
export const initTermDescriptionTinyMce = function( jQuery ) {
	// Get the table cell that contains the description textarea.
	var descriptionTd = jQuery( ".term-description-wrap" ).find( "td" );

	// Get the description textarea label.
	var descriptionLabel = jQuery( ".term-description-wrap" ).find( "label" );

	// Get the textNode from the original textarea.
	var textNode = descriptionTd.find( "textarea" ).val();

	// Get the editor container.
	var newEditor = document.getElementById( "wp-description-wrap" );

	// Get the description help text below the textarea.
	var text = descriptionTd.find( "p" );

	// Empty the TD with the old description textarea.
	descriptionTd.html( "" );

	/*
     * The editor is printed out via PHP as child of the form and initially
     * hidden with a child `>` CSS selector. We now move the editor and the
     * help text in a new position so the previous CSS rule won't apply any
     * longer and the editor will be visible.
     */
	descriptionTd.append( newEditor ).append( text );

	// Populate the editor textarea with the original content.
	document.getElementById( "description" ).value = textNode;

	// Make the description textarea label plain text removing the label tag.
	descriptionLabel.replaceWith( descriptionLabel.html() );
};
