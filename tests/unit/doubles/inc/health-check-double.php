<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc;

use WPSEO_Health_Check;

/**
 * Class WPSEO_Health_Check_Double exposes protected properties and methods needed by the unit tests.
 */
class WPSEO_Health_Check_Double extends WPSEO_Health_Check {

	/**
	 * Indicates that the test has executed.
	 *
	 * @var bool
	 */
	public $has_run = false;

	/**
	 * Can this test be run from AJAX or not.
	 *
	 * @var bool
	 */
	public $async;

	/**
	 * Runs the test and returns the result.
	 */
	public function run() {
		$this->has_run = true;
	}

	/**
	 * Retrieves the badge and ensure usable values are set.
	 *
	 * @return array The proper formatted badge.
	 */
	public function get_badge() {
		return parent::get_badge();
	}

	/**
	 * WordPress converts the underscores to dashes. To prevent issues we have
	 * to do it as well.
	 *
	 * @return string The formatted testname.
	 */
	public function get_test_name() {
		return parent::get_test_name();
	}

	/**
	 * Checks if the health check is async.
	 *
	 * @return bool True when check is async.
	 */
	public function is_async() {
		return parent::is_async();
	}

	/**
	 * Adds a text to the bottom of the Site Health check to indicate it is a Yoast SEO Site Health Check.
	 */
	public function add_yoast_signature() {
		parent::add_yoast_signature();
	}
}
