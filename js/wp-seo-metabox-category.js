(function( $ ) {
	'use strict';

	var taxonomyCategory, primaryCategorySelect;

	/**
	 * @todo Make this more general for all taxonomy meta boxes, currently it only works for post categories
	 * @todo Update primary category select when you add a new category
	 *
	 */
	function addPrimaryCategorySelection() {
		taxonomyCategory = $( '#taxonomy-category' );

		primaryCategorySelect = $( '<select id="primary_post_category"></select>' );
		primaryCategorySelect.hide();

		taxonomyCategory.append( primaryCategorySelect );

		updatePrimaryCategorySelect();

		taxonomyCategory.find( 'input[type="checkbox"]' ).on( 'click', updatePrimaryCategorySelect );
	}

	function updatePrimaryCategorySelect() {
		var checked = taxonomyCategory.find( '#categorychecklist input[type="checkbox"]:checked' );
		var selectedPrimaryCategory = primaryCategorySelect.val();

		var primaryCategorySelectHtml = '';
		checked.each( function( i, item ) {
			item = $( item );

			var label = item.closest( 'label' );

			var selectedHtml = '';
			if ( selectedPrimaryCategory === item.val() ) {
				selectedHtml = ' selected="selected"';
			}

			primaryCategorySelectHtml += '<option value="' + item.val() + '"' + selectedHtml + '>' + label.text() + '</option>';
		} );

		primaryCategorySelect.html( primaryCategorySelectHtml );

		if ( checked.length <= 1 ) {
			primaryCategorySelect.hide();
		} else {
			primaryCategorySelect.show();
		}
	}

	$( addPrimaryCategorySelection );
}( jQuery ));
