<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Upgrade;

/**
 * Test Helper Class.
 */
final class Upgrade_Double extends WPSEO_Upgrade {

	/**
	 * Override the constructor to avoid calling that logic.
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * Cleans the option to make sure only relevant settings are there.
	 *
	 * @param string $option_name Option name save.
	 *
	 * @return void
	 */
	public function cleanup_option_data( $option_name ) {
		parent::cleanup_option_data( $option_name );
	}

	/**
	 * Test double. Retrieves the option value directly from the database.
	 *
	 * @param string $option_name Option to retrieve.
	 *
	 * @return array|mixed The content of the option if exists, otherwise an empty array.
	 */
	public function get_option_from_database( $option_name ) {
		return parent::get_option_from_database( $option_name );
	}

	/**
	 * Test double. Saves an option setting to where it should be stored.
	 *
	 * @param array       $source_data    The option containing the value to be migrated.
	 * @param string      $source_setting Name of the key in the "from" option.
	 * @param string|null $target_setting Name of the key in the "to" option.
	 *
	 * @return void
	 */
	public function save_option_setting( $source_data, $source_setting, $target_setting = null ) {
		parent::save_option_setting( $source_data, $source_setting, $target_setting );
	}

	/**
	 * Test double. Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 *
	 * @param string|null $previous_version The previous version.
	 *
	 * @return void
	 */
	public function finish_up( $previous_version = null ) {
		parent::finish_up( $previous_version );
	}
}
