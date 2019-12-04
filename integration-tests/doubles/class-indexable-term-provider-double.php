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
	 * Converts the indexable data to make it compatible with the database.
	 *
	 * @param array $indexable_data The indexable data to prepare.
	 *
	 * @return array The converted indexable data.
	 */
	public function convert_indexable_data( $indexable_data ) {
		return parent::convert_indexable_data( $indexable_data );
	}

	/**
	 * Renames and converts some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to rename and convert.
	 *
	 * @return array The renamed and converted indexable data.
	 */
	public function rename_indexable_data( &$indexable_data ) {
		return parent::rename_indexable_data( $indexable_data );
	}

	/**
	 * Converts the noindex value to a database compatible one.
	 *
	 * @param bool $noindex The current noindex value.
	 *
	 * @return string|null The converted value.
	 */
	public function convert_noindex( $noindex ) {
		return parent::convert_noindex( $noindex );
	}
}
