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
	 * Converts some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to convert.
	 *
	 * @return array The converted indexable data.
	 */
	public function convert_indexable_data( $indexable_data ) {
		return parent::convert_indexable_data( $indexable_data );
	}

	/**
	 * Converts the advanced meta settings to its database variant.
	 *
	 * @param array $indexable_data The indexable data to convert the advanced meta settings from.
	 *
	 * @return string The converted advanced meta settings.
	 */
	public function convert_advanced( &$indexable_data ) {
		return parent::convert_advanced( $indexable_data );
	}

	/**
	 * Converts the cornerstone value to its database variant.
	 *
	 * @param string $cornerstone_value The cornerstone value.
	 *
	 * @return string The converted indexable cornerstone value.
	 */
	public function convert_cornerstone( $cornerstone_value ) {
		return parent::convert_cornerstone( $cornerstone_value );
	}

	/**
	 * Converts the nofollow value to a database compatible one.
	 *
	 * @param bool $nofollow The current nofollow value.
	 *
	 * @return string The converted value.
	 */
	public function convert_nofollow( $nofollow ) {
		return parent::convert_nofollow( $nofollow );
	}

	/**
	 * Converts the noindex value to a database compatible one.
	 *
	 * @param string $noindex The current noindex value.
	 *
	 * @return string|null The converted value.
	 */
	public function convert_noindex( $noindex ) {
		return parent::convert_noindex( $noindex );
	}
}
