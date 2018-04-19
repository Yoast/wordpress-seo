<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Upgrade_Double extends WPSEO_Upgrade {

	/**
	 * Override the constructor to void calling that logic.
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * @inheritdoc
	 */
	public function cleanup_option_data( $option_name ) {
		parent::cleanup_option_data( $option_name );
	}

	/**
	 * @inheritdoc
	 */
	public function get_option_from_database( $option_name ) {
		return parent::get_option_from_database( $option_name );
	}

	/**
	 * @inheritdoc
	 */
	public function save_option_setting( $source_data, $source_setting, $target_setting = null ) {
		parent::save_option_setting( $source_data, $source_setting, $target_setting );
	}

	/**
	 * @inheritdoc
	 */
	public function finish_up() {
		parent::finish_up();
	}
}
