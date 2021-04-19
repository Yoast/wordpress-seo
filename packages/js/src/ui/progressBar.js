/**
 * Represents the progressbar for the reindexing for the links.
 */
export default class ProgressBar {
	/**
	 * The constructor.
	 *
	 * @param {number} total              The total amount of items.
	 * @param {string} countElement       Selector for the count element.
	 * @param {string} progressBarElement Select for the progress bar element.
	 */
	constructor( total, countElement, progressBarElement ) {
		this.element = jQuery( countElement );
		this.progressbarTarget = jQuery( progressBarElement ).progressbar( { value: 0 } );
		this.total = parseInt( total, 10 );
		this.totalProcessed = 0;
	}

	/**
	 * Updates the processbar.
	 *
	 * @param {number} countProcessed The amount of items that has been process.
	 *
	 * @returns {void}
	 */
	update( countProcessed ) {
		this.totalProcessed += countProcessed;
		const newWidth = this.totalProcessed * ( 100 / this.total );

		this.progressbarTarget.progressbar( "value", Math.round( newWidth ) );
		this.element.html( this.totalProcessed );
	}

	/**
	 * Completes the processbar.
	 *
	 * @returns {void}
	 */
	complete() {
		this.progressbarTarget.progressbar( "value", 100 );
	}
}
