<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Options;
use Yoast\WP\SEO\Config\Migration_Status;

/**
 * Runs the Links_Table health check.
 */
class Links_Table_Runner implements Runner_Interface {

	/**
	 * Is set to true when the links table is accessible.
	 *
	 * @var bool
	 */
	private $links_table_accessible = false;

	/**
	 * The Migration_Status object used to determine whether the links table is accessible.
	 *
	 * @var Migration_Status
	 */
	private $migration_status;

	/**
	 * The WPSEO_Options object used to determine whether the health check should run or not.
	 *
	 * @var WPSEO_Options
	 */
	private $options;

	/**
	 * Constructor.
	 *
	 * @param Migration_Status $migration_status Object used to determine whether the links table is accessible.
	 * @param WPSEO_Options    $options Object used to determine whether the health check should run.
	 */
	public function __construct(
		Migration_Status $migration_status,
		WPSEO_Options $options
	) {
		$this->migration_status = $migration_status;
		$this->options          = $options;
	}

	/**
	 * Runs the health check. Checks if the tagline is set to WordPress' default tagline, or to its set translation.
	 *
	 * @return void
	 */
	public function run() {
		if ( ! $this->should_run() ) {
			return;
		}

		$this->links_table_accessible = $this->migration_status->is_version( 'free', WPSEO_VERSION );
	}

	/**
	 * Determines whether the health check should run or not.
	 *
	 * @return bool True if the text link counter feature is enabled.
	 */
	public function should_run() {
		return $this->options->get( 'enable_text_link_counter' );
	}

	/**
	 * Returns true if the links table is accessible
	 *
	 * @return bool The boolean indicating if the health check was succesful.
	 */
	public function is_successful() {
		return $this->links_table_accessible;
	}
}
