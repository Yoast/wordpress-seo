<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Health_Check;
use Yoast\WP\SEO\Services\Health_Check\Runner_Interface;

/**
 * Used for mocking Health_Check implementations. This is required because implementations of a health check have to set a health check runner to function.
 */
class Health_Check_Double extends Health_Check {

	/**
	 * Constructs the double.
	 *
	 * @param Runner_Interface $runner The health check runner to use.
	 *
	 * @return void
	 */
	public function __construct( Runner_Interface $runner ) {
		parent::set_runner( $runner );
	}

	/**
	 * Runs the health check, and returns its result in the format that WordPress requires to show the results to the user.
	 *
	 * @return string[] The array containing a WordPress site status report.
	 */
	protected function get_result() {
		return [];
	}

	/**
	 * Returns whether the health check should be excluded from the results.
	 *
	 * @return bool Whether the check should be excluded.
	 */
	public function is_excluded() {
		return false;
	}
}
