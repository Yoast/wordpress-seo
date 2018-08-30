<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Taxonomy_Content_Fields_Double extends WPSEO_Taxonomy_Content_Fields {

	/**
	 * Override an option value.
	 *
	 * @param string $option_name  The target key which will be overwritten.
	 * @param string $option_value The new value for the option.
	 */
	public function set_option( $option_name, $option_value ) {
		$this->options[ $option_name ] = $option_value;
	}
}
