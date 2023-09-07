import { markers } from "yoastseo";

/**
 * Applies a single Mark in the Elementor editor.
 * @param {Mark} mark The mark.
 *
 * @returns {void}
 */
function applyMarkElementor( mark ) {
	const currentDocument = window.elementor.documents.getCurrent();
	const widgetContainers = currentDocument.$element.find( ".elementor-widget-container" );

	let position = 0;
	widgetContainers.each( ( index, element ) => {
		const rawHtml = element.innerHTML;

		if ( mark.hasPosition() ) {
			// Position-based highlighting
			const start = mark.getPositionStart();

			// Apply mark if start is between position and position + rawHtml.length
			if ( start >= position && start <= position + rawHtml.length ) {
				element.innerHTML = mark.applyWithPosition( rawHtml );
				return;
			}
		} else {
			// Search-based highlighting
			if ( element.innerHTML.includes( mark.getOriginal() ) ) {
				element.innerHTML = mark.applyWithReplace( rawHtml );
				return;
			}
		}

		position += rawHtml.length;
	} );
}

/**
 * Applies the highlighting for Elementor.
 *
 * @param {Mark[]} marks The array of marks.
 *
 * @returns {void}
 */
export function applyMarksElementor( marks ) {
	// Remove existing Marks.
	const currentDocument = window.elementor.documents.getCurrent();
	const widgetContainers = currentDocument.$element.find( ".elementor-widget-container" );

	widgetContainers.each( ( index, element ) => {
		element.innerHTML = markers.removeMarks( element.innerHTML );
	} );

	// Apply new Marks.
	marks.forEach( mark => applyMarkElementor( mark ) );

	// Remove invalid marks?
	// Add bogus element to not save, or remove marks on saving?
}
