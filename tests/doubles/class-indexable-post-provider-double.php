<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Indexable_Service_Post_Provider_Double extends WPSEO_Indexable_Service_Post_Provider {

	/**
	 * @inheritdoc
	 */
	public function convert_indexable_data( $indexable_data ) {
		return parent::convert_indexable_data( $indexable_data );
	}

	/**
	 * @inheritdoc
	 */
	public function convert_advanced( &$indexable_data ) {
		return parent::convert_advanced( $indexable_data );
	}
}
