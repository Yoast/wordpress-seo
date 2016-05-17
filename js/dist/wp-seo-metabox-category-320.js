(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wp, _, wpseoPrimaryCategoryL10n */
(function( $ ) {
	'use strict';

	var primaryTermInputTemplate, primaryTermUITemplate, primaryTermScreenReaderTemplate;
	var taxonomies = wpseoPrimaryCategoryL10n.taxonomies;

	/**
	 * Checks if the elements to make a term the primary term and the display for a primary term exist
	 *
	 * @param {Object} checkbox
	 *
	 * @return {boolean}
	 */
	function hasPrimaryTermElements( checkbox ) {
		return 1 === $( checkbox ).closest( 'li' ).children( '.wpseo-make-primary-term' ).length;
	}

	/**
	 * Retrieves the primary term for a taxonomy
	 *
	 * @param {string} taxonomyName
	 * @return {string}
	 */
	function getPrimaryTerm( taxonomyName ) {
		var primaryTermInput;

		primaryTermInput = $( '#yoast-wpseo-primary-' + taxonomyName );
		return primaryTermInput.val();
	}

	/**
	 * Sets the primary term for a taxonomy
	 *
	 * @param {string} taxonomyName
	 * @param {string} termId
	 */
	function setPrimaryTerm( taxonomyName, termId ) {
		var primaryTermInput;

		primaryTermInput = $( '#yoast-wpseo-primary-' + taxonomyName );
		primaryTermInput.val( termId ).trigger( 'change' );
	}

	/**
	 * Makes the first term primary for a certain taxonomy
	 *
	 * @param {string} taxonomyName
	 */
	function makeFirstTermPrimary( taxonomyName ) {
		var firstTerm = $( '#' + taxonomyName + 'checklist input[type="checkbox"]:checked:first' );

		setPrimaryTerm( taxonomyName, firstTerm.val() );
		updatePrimaryTermSelectors( taxonomyName );
	}

	/**
	 * Updates the primary term selectors/indicators for a certain taxonomy
	 *
	 * @param {string} taxonomyName
	 */
	function updatePrimaryTermSelectors( taxonomyName ) {
		var checkedTerms, uncheckedTerms;
		var listItem, label;

		checkedTerms = $( '#' + taxonomyName + 'checklist input[type="checkbox"]:checked' );
		uncheckedTerms = $( '#' + taxonomyName + 'checklist input[type="checkbox"]:not(:checked)' );

		// Remove all classes for a consistent experience
		checkedTerms.add( uncheckedTerms ).closest( 'li' )
			.removeClass( 'wpseo-term-unchecked' )
			.removeClass( 'wpseo-primary-term' )
			.removeClass( 'wpseo-non-primary-term' );

		$( '.wpseo-primary-category-label' ).remove();

		// If there is only one term selected we don't want to show our interface.
		if ( checkedTerms.length <= 1 ) {
			checkedTerms.add( uncheckedTerms ).closest( 'li' ).addClass( 'wpseo-term-unchecked' );
			return;
		}

		checkedTerms.each(function( i, term ) {
			term = $( term );
			listItem = term.closest( 'li' );

			// Create our interface elements if they don't exist.
			if ( ! hasPrimaryTermElements( term ) ) {
				createPrimaryTermElements( taxonomyName, term );
			}

			if ( term.val() === getPrimaryTerm( taxonomyName ) ) {
				listItem.addClass( 'wpseo-primary-term' );

				label = term.closest( 'label' );
				label.find( '.wpseo-primary-category-label' ).remove();
				label.append( primaryTermScreenReaderTemplate({
					taxonomy: taxonomies[ taxonomyName ]
				}) );
			}
			else {
				listItem.addClass( 'wpseo-non-primary-term' );
			}
		} );

		// Hide our interface elements on all unchecked checkboxes.
		uncheckedTerms.closest( 'li' ).addClass( 'wpseo-term-unchecked' );
	}

	/**
	 * Creates the elements necessary to show something is a primary term or to make it the primary term
	 *
	 * @param {string} taxonomyName
	 * @param {Object} checkbox
	 */
	function createPrimaryTermElements( taxonomyName, checkbox ) {
		var label, html;

		label = $( checkbox ).closest( 'label' );

		html = primaryTermUITemplate({
			taxonomy: taxonomies[ taxonomyName ],
			term: label.text()
		});

		label.after( html );
	}

	/**
	 * Returns the term checkbox handler for a certain taxonomy name
	 *
	 * @param {string} taxonomyName
	 * @return {Function}
	 */
	function termCheckboxHandler( taxonomyName ) {
		return function() {
			// If the user unchecks the primary category we have to select any new primary term
			if ( false === $( this ).prop( 'checked' ) && $( this ).val() === getPrimaryTerm( taxonomyName ) ) {
				makeFirstTermPrimary( taxonomyName );
			}

			ensurePrimaryTerm(taxonomyName);

			updatePrimaryTermSelectors( taxonomyName );
		};
	}

	/**
	 * Returns the term list add handler for a certain taxonomy name
	 *
	 * @param {string} taxonomyName
	 * @return {Function}
	 */
	function termListAddHandler( taxonomyName ) {
		return function() {
			ensurePrimaryTerm(taxonomyName);
			updatePrimaryTermSelectors( taxonomyName );
		};
	}

	/**
	 * If we check a term while there is no primary term we make that one the primary term.
	 *
	 * @param {string} taxonomyName
	 */
	function ensurePrimaryTerm(taxonomyName) {
		if ('' === getPrimaryTerm(taxonomyName)) {
			makeFirstTermPrimary(taxonomyName);
		}
	}

	/**
	 * Returns the make primary event handler for a certain taxonomy name
	 *
	 * @param {string} taxonomyName
	 * @return {Function}
	 */
	function makePrimaryHandler( taxonomyName ) {
		return function( e ) {
			var term, checkbox;

			term = $( e.currentTarget );
			checkbox = term.siblings( 'label' ).find( 'input' );

			setPrimaryTerm( taxonomyName, checkbox.val() );

			updatePrimaryTermSelectors( taxonomyName );

			// The clicked link will be hidden so we need to focus something different.
			checkbox.focus();
		};
	}

	$.fn.initYstSEOPrimaryCategory = function() {
		return this.each(function( i, taxonomy ) {
			var metaboxTaxonomy, html;

			metaboxTaxonomy = $( '#' + taxonomy.name + 'div' );

			html = primaryTermInputTemplate({
				taxonomy: taxonomy
			});

			metaboxTaxonomy.append( html );

			updatePrimaryTermSelectors( taxonomy.name );

			metaboxTaxonomy.on( 'click', 'input[type="checkbox"]', termCheckboxHandler( taxonomy.name ) );

			// When the AJAX Request is done, this event will be fired.
			metaboxTaxonomy.on( 'wpListAddEnd', '#' + taxonomy.name + 'checklist', termListAddHandler( taxonomy.name ) );

			metaboxTaxonomy.on( 'click', '.wpseo-make-primary-term', makePrimaryHandler( taxonomy.name ) );
		});
	};

	$( function() {
		// Initialize our templates
		primaryTermInputTemplate = wp.template( 'primary-term-input' );
		primaryTermUITemplate = wp.template( 'primary-term-ui' );
		primaryTermScreenReaderTemplate = wp.template( 'primary-term-screen-reader' );

		$( _.values( taxonomies ) ).initYstSEOPrimaryCategory();
	});
}( jQuery ));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW1ldGFib3gtY2F0ZWdvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3AsIF8sIHdwc2VvUHJpbWFyeUNhdGVnb3J5TDEwbiAqL1xuKGZ1bmN0aW9uKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHByaW1hcnlUZXJtSW5wdXRUZW1wbGF0ZSwgcHJpbWFyeVRlcm1VSVRlbXBsYXRlLCBwcmltYXJ5VGVybVNjcmVlblJlYWRlclRlbXBsYXRlO1xuXHR2YXIgdGF4b25vbWllcyA9IHdwc2VvUHJpbWFyeUNhdGVnb3J5TDEwbi50YXhvbm9taWVzO1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVsZW1lbnRzIHRvIG1ha2UgYSB0ZXJtIHRoZSBwcmltYXJ5IHRlcm0gYW5kIHRoZSBkaXNwbGF5IGZvciBhIHByaW1hcnkgdGVybSBleGlzdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY2hlY2tib3hcblx0ICpcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICovXG5cdGZ1bmN0aW9uIGhhc1ByaW1hcnlUZXJtRWxlbWVudHMoIGNoZWNrYm94ICkge1xuXHRcdHJldHVybiAxID09PSAkKCBjaGVja2JveCApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJy53cHNlby1tYWtlLXByaW1hcnktdGVybScgKS5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBwcmltYXJ5IHRlcm0gZm9yIGEgdGF4b25vbXlcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRheG9ub215TmFtZVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQcmltYXJ5VGVybSggdGF4b25vbXlOYW1lICkge1xuXHRcdHZhciBwcmltYXJ5VGVybUlucHV0O1xuXG5cdFx0cHJpbWFyeVRlcm1JbnB1dCA9ICQoICcjeW9hc3Qtd3BzZW8tcHJpbWFyeS0nICsgdGF4b25vbXlOYW1lICk7XG5cdFx0cmV0dXJuIHByaW1hcnlUZXJtSW5wdXQudmFsKCk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgcHJpbWFyeSB0ZXJtIGZvciBhIHRheG9ub215XG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YXhvbm9teU5hbWVcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRlcm1JZFxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJpbWFyeVRlcm0oIHRheG9ub215TmFtZSwgdGVybUlkICkge1xuXHRcdHZhciBwcmltYXJ5VGVybUlucHV0O1xuXG5cdFx0cHJpbWFyeVRlcm1JbnB1dCA9ICQoICcjeW9hc3Qtd3BzZW8tcHJpbWFyeS0nICsgdGF4b25vbXlOYW1lICk7XG5cdFx0cHJpbWFyeVRlcm1JbnB1dC52YWwoIHRlcm1JZCApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgdGhlIGZpcnN0IHRlcm0gcHJpbWFyeSBmb3IgYSBjZXJ0YWluIHRheG9ub215XG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YXhvbm9teU5hbWVcblx0ICovXG5cdGZ1bmN0aW9uIG1ha2VGaXJzdFRlcm1QcmltYXJ5KCB0YXhvbm9teU5hbWUgKSB7XG5cdFx0dmFyIGZpcnN0VGVybSA9ICQoICcjJyArIHRheG9ub215TmFtZSArICdjaGVja2xpc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQ6Zmlyc3QnICk7XG5cblx0XHRzZXRQcmltYXJ5VGVybSggdGF4b25vbXlOYW1lLCBmaXJzdFRlcm0udmFsKCkgKTtcblx0XHR1cGRhdGVQcmltYXJ5VGVybVNlbGVjdG9ycyggdGF4b25vbXlOYW1lICk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgcHJpbWFyeSB0ZXJtIHNlbGVjdG9ycy9pbmRpY2F0b3JzIGZvciBhIGNlcnRhaW4gdGF4b25vbXlcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRheG9ub215TmFtZVxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlUHJpbWFyeVRlcm1TZWxlY3RvcnMoIHRheG9ub215TmFtZSApIHtcblx0XHR2YXIgY2hlY2tlZFRlcm1zLCB1bmNoZWNrZWRUZXJtcztcblx0XHR2YXIgbGlzdEl0ZW0sIGxhYmVsO1xuXG5cdFx0Y2hlY2tlZFRlcm1zID0gJCggJyMnICsgdGF4b25vbXlOYW1lICsgJ2NoZWNrbGlzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcgKTtcblx0XHR1bmNoZWNrZWRUZXJtcyA9ICQoICcjJyArIHRheG9ub215TmFtZSArICdjaGVja2xpc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOm5vdCg6Y2hlY2tlZCknICk7XG5cblx0XHQvLyBSZW1vdmUgYWxsIGNsYXNzZXMgZm9yIGEgY29uc2lzdGVudCBleHBlcmllbmNlXG5cdFx0Y2hlY2tlZFRlcm1zLmFkZCggdW5jaGVja2VkVGVybXMgKS5jbG9zZXN0KCAnbGknIClcblx0XHRcdC5yZW1vdmVDbGFzcyggJ3dwc2VvLXRlcm0tdW5jaGVja2VkJyApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoICd3cHNlby1wcmltYXJ5LXRlcm0nIClcblx0XHRcdC5yZW1vdmVDbGFzcyggJ3dwc2VvLW5vbi1wcmltYXJ5LXRlcm0nICk7XG5cblx0XHQkKCAnLndwc2VvLXByaW1hcnktY2F0ZWdvcnktbGFiZWwnICkucmVtb3ZlKCk7XG5cblx0XHQvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSB0ZXJtIHNlbGVjdGVkIHdlIGRvbid0IHdhbnQgdG8gc2hvdyBvdXIgaW50ZXJmYWNlLlxuXHRcdGlmICggY2hlY2tlZFRlcm1zLmxlbmd0aCA8PSAxICkge1xuXHRcdFx0Y2hlY2tlZFRlcm1zLmFkZCggdW5jaGVja2VkVGVybXMgKS5jbG9zZXN0KCAnbGknICkuYWRkQ2xhc3MoICd3cHNlby10ZXJtLXVuY2hlY2tlZCcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjaGVja2VkVGVybXMuZWFjaChmdW5jdGlvbiggaSwgdGVybSApIHtcblx0XHRcdHRlcm0gPSAkKCB0ZXJtICk7XG5cdFx0XHRsaXN0SXRlbSA9IHRlcm0uY2xvc2VzdCggJ2xpJyApO1xuXG5cdFx0XHQvLyBDcmVhdGUgb3VyIGludGVyZmFjZSBlbGVtZW50cyBpZiB0aGV5IGRvbid0IGV4aXN0LlxuXHRcdFx0aWYgKCAhIGhhc1ByaW1hcnlUZXJtRWxlbWVudHMoIHRlcm0gKSApIHtcblx0XHRcdFx0Y3JlYXRlUHJpbWFyeVRlcm1FbGVtZW50cyggdGF4b25vbXlOYW1lLCB0ZXJtICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGVybS52YWwoKSA9PT0gZ2V0UHJpbWFyeVRlcm0oIHRheG9ub215TmFtZSApICkge1xuXHRcdFx0XHRsaXN0SXRlbS5hZGRDbGFzcyggJ3dwc2VvLXByaW1hcnktdGVybScgKTtcblxuXHRcdFx0XHRsYWJlbCA9IHRlcm0uY2xvc2VzdCggJ2xhYmVsJyApO1xuXHRcdFx0XHRsYWJlbC5maW5kKCAnLndwc2VvLXByaW1hcnktY2F0ZWdvcnktbGFiZWwnICkucmVtb3ZlKCk7XG5cdFx0XHRcdGxhYmVsLmFwcGVuZCggcHJpbWFyeVRlcm1TY3JlZW5SZWFkZXJUZW1wbGF0ZSh7XG5cdFx0XHRcdFx0dGF4b25vbXk6IHRheG9ub21pZXNbIHRheG9ub215TmFtZSBdXG5cdFx0XHRcdH0pICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGlzdEl0ZW0uYWRkQ2xhc3MoICd3cHNlby1ub24tcHJpbWFyeS10ZXJtJyApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEhpZGUgb3VyIGludGVyZmFjZSBlbGVtZW50cyBvbiBhbGwgdW5jaGVja2VkIGNoZWNrYm94ZXMuXG5cdFx0dW5jaGVja2VkVGVybXMuY2xvc2VzdCggJ2xpJyApLmFkZENsYXNzKCAnd3BzZW8tdGVybS11bmNoZWNrZWQnICk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgZWxlbWVudHMgbmVjZXNzYXJ5IHRvIHNob3cgc29tZXRoaW5nIGlzIGEgcHJpbWFyeSB0ZXJtIG9yIHRvIG1ha2UgaXQgdGhlIHByaW1hcnkgdGVybVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGF4b25vbXlOYW1lXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjaGVja2JveFxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlUHJpbWFyeVRlcm1FbGVtZW50cyggdGF4b25vbXlOYW1lLCBjaGVja2JveCApIHtcblx0XHR2YXIgbGFiZWwsIGh0bWw7XG5cblx0XHRsYWJlbCA9ICQoIGNoZWNrYm94ICkuY2xvc2VzdCggJ2xhYmVsJyApO1xuXG5cdFx0aHRtbCA9IHByaW1hcnlUZXJtVUlUZW1wbGF0ZSh7XG5cdFx0XHR0YXhvbm9teTogdGF4b25vbWllc1sgdGF4b25vbXlOYW1lIF0sXG5cdFx0XHR0ZXJtOiBsYWJlbC50ZXh0KClcblx0XHR9KTtcblxuXHRcdGxhYmVsLmFmdGVyKCBodG1sICk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdGVybSBjaGVja2JveCBoYW5kbGVyIGZvciBhIGNlcnRhaW4gdGF4b25vbXkgbmFtZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGF4b25vbXlOYW1lXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuXHQgKi9cblx0ZnVuY3Rpb24gdGVybUNoZWNrYm94SGFuZGxlciggdGF4b25vbXlOYW1lICkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIElmIHRoZSB1c2VyIHVuY2hlY2tzIHRoZSBwcmltYXJ5IGNhdGVnb3J5IHdlIGhhdmUgdG8gc2VsZWN0IGFueSBuZXcgcHJpbWFyeSB0ZXJtXG5cdFx0XHRpZiAoIGZhbHNlID09PSAkKCB0aGlzICkucHJvcCggJ2NoZWNrZWQnICkgJiYgJCggdGhpcyApLnZhbCgpID09PSBnZXRQcmltYXJ5VGVybSggdGF4b25vbXlOYW1lICkgKSB7XG5cdFx0XHRcdG1ha2VGaXJzdFRlcm1QcmltYXJ5KCB0YXhvbm9teU5hbWUgKTtcblx0XHRcdH1cblxuXHRcdFx0ZW5zdXJlUHJpbWFyeVRlcm0odGF4b25vbXlOYW1lKTtcblxuXHRcdFx0dXBkYXRlUHJpbWFyeVRlcm1TZWxlY3RvcnMoIHRheG9ub215TmFtZSApO1xuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdGVybSBsaXN0IGFkZCBoYW5kbGVyIGZvciBhIGNlcnRhaW4gdGF4b25vbXkgbmFtZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGF4b25vbXlOYW1lXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuXHQgKi9cblx0ZnVuY3Rpb24gdGVybUxpc3RBZGRIYW5kbGVyKCB0YXhvbm9teU5hbWUgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW5zdXJlUHJpbWFyeVRlcm0odGF4b25vbXlOYW1lKTtcblx0XHRcdHVwZGF0ZVByaW1hcnlUZXJtU2VsZWN0b3JzKCB0YXhvbm9teU5hbWUgKTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIElmIHdlIGNoZWNrIGEgdGVybSB3aGlsZSB0aGVyZSBpcyBubyBwcmltYXJ5IHRlcm0gd2UgbWFrZSB0aGF0IG9uZSB0aGUgcHJpbWFyeSB0ZXJtLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGF4b25vbXlOYW1lXG5cdCAqL1xuXHRmdW5jdGlvbiBlbnN1cmVQcmltYXJ5VGVybSh0YXhvbm9teU5hbWUpIHtcblx0XHRpZiAoJycgPT09IGdldFByaW1hcnlUZXJtKHRheG9ub215TmFtZSkpIHtcblx0XHRcdG1ha2VGaXJzdFRlcm1QcmltYXJ5KHRheG9ub215TmFtZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG1ha2UgcHJpbWFyeSBldmVudCBoYW5kbGVyIGZvciBhIGNlcnRhaW4gdGF4b25vbXkgbmFtZVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGF4b25vbXlOYW1lXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuXHQgKi9cblx0ZnVuY3Rpb24gbWFrZVByaW1hcnlIYW5kbGVyKCB0YXhvbm9teU5hbWUgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0dmFyIHRlcm0sIGNoZWNrYm94O1xuXG5cdFx0XHR0ZXJtID0gJCggZS5jdXJyZW50VGFyZ2V0ICk7XG5cdFx0XHRjaGVja2JveCA9IHRlcm0uc2libGluZ3MoICdsYWJlbCcgKS5maW5kKCAnaW5wdXQnICk7XG5cblx0XHRcdHNldFByaW1hcnlUZXJtKCB0YXhvbm9teU5hbWUsIGNoZWNrYm94LnZhbCgpICk7XG5cblx0XHRcdHVwZGF0ZVByaW1hcnlUZXJtU2VsZWN0b3JzKCB0YXhvbm9teU5hbWUgKTtcblxuXHRcdFx0Ly8gVGhlIGNsaWNrZWQgbGluayB3aWxsIGJlIGhpZGRlbiBzbyB3ZSBuZWVkIHRvIGZvY3VzIHNvbWV0aGluZyBkaWZmZXJlbnQuXG5cdFx0XHRjaGVja2JveC5mb2N1cygpO1xuXHRcdH07XG5cdH1cblxuXHQkLmZuLmluaXRZc3RTRU9QcmltYXJ5Q2F0ZWdvcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBpLCB0YXhvbm9teSApIHtcblx0XHRcdHZhciBtZXRhYm94VGF4b25vbXksIGh0bWw7XG5cblx0XHRcdG1ldGFib3hUYXhvbm9teSA9ICQoICcjJyArIHRheG9ub215Lm5hbWUgKyAnZGl2JyApO1xuXG5cdFx0XHRodG1sID0gcHJpbWFyeVRlcm1JbnB1dFRlbXBsYXRlKHtcblx0XHRcdFx0dGF4b25vbXk6IHRheG9ub215XG5cdFx0XHR9KTtcblxuXHRcdFx0bWV0YWJveFRheG9ub215LmFwcGVuZCggaHRtbCApO1xuXG5cdFx0XHR1cGRhdGVQcmltYXJ5VGVybVNlbGVjdG9ycyggdGF4b25vbXkubmFtZSApO1xuXG5cdFx0XHRtZXRhYm94VGF4b25vbXkub24oICdjbGljaycsICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCB0ZXJtQ2hlY2tib3hIYW5kbGVyKCB0YXhvbm9teS5uYW1lICkgKTtcblxuXHRcdFx0Ly8gV2hlbiB0aGUgQUpBWCBSZXF1ZXN0IGlzIGRvbmUsIHRoaXMgZXZlbnQgd2lsbCBiZSBmaXJlZC5cblx0XHRcdG1ldGFib3hUYXhvbm9teS5vbiggJ3dwTGlzdEFkZEVuZCcsICcjJyArIHRheG9ub215Lm5hbWUgKyAnY2hlY2tsaXN0JywgdGVybUxpc3RBZGRIYW5kbGVyKCB0YXhvbm9teS5uYW1lICkgKTtcblxuXHRcdFx0bWV0YWJveFRheG9ub215Lm9uKCAnY2xpY2snLCAnLndwc2VvLW1ha2UtcHJpbWFyeS10ZXJtJywgbWFrZVByaW1hcnlIYW5kbGVyKCB0YXhvbm9teS5uYW1lICkgKTtcblx0XHR9KTtcblx0fTtcblxuXHQkKCBmdW5jdGlvbigpIHtcblx0XHQvLyBJbml0aWFsaXplIG91ciB0ZW1wbGF0ZXNcblx0XHRwcmltYXJ5VGVybUlucHV0VGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggJ3ByaW1hcnktdGVybS1pbnB1dCcgKTtcblx0XHRwcmltYXJ5VGVybVVJVGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggJ3ByaW1hcnktdGVybS11aScgKTtcblx0XHRwcmltYXJ5VGVybVNjcmVlblJlYWRlclRlbXBsYXRlID0gd3AudGVtcGxhdGUoICdwcmltYXJ5LXRlcm0tc2NyZWVuLXJlYWRlcicgKTtcblxuXHRcdCQoIF8udmFsdWVzKCB0YXhvbm9taWVzICkgKS5pbml0WXN0U0VPUHJpbWFyeUNhdGVnb3J5KCk7XG5cdH0pO1xufSggalF1ZXJ5ICkpO1xuIl19
