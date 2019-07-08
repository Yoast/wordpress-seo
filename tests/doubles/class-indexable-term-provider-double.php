<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Indexable_Service_Term_Provider_Double extends WPSEO_Indexable_Service_Term_Provider {

	/**
	 * @inheritdoc
	 */
	public function convert_indexable_data( $indexable_data ) {
		return parent::convert_indexable_data( $indexable_data );
	}

	/**
	 * @inheritdoc
	 */
	public function rename_indexable_data( &$indexable_data ) {
		return parent::rename_indexable_data( $indexable_data );
	}

	/**
	 * @inheritdoc
	 */
	public function convert_noindex( $noindex ) {
		return parent::convert_noindex( $noindex );
	}
}
