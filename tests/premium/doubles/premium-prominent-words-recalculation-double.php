<?php
/**
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Premium_Prominent_Words_Recalculation_Double extends WPSEO_Premium_Prominent_Words_Recalculation {

	/**
	 * @inheritdoc
	 */
	public function get_indexable_post_type_labels( $post_types ) {
		return parent::get_indexable_post_type_labels( $post_types );
	}

	/**
	 * @inheritdoc
	 */
	public function retrieve_post_type_label( $post_type ) {
		return parent::retrieve_post_type_label( $post_type );
	}

}
