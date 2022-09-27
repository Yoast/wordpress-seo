<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Health_Check;
use Yoast\WP\SEO\Services\Health_Check\Runner_Interface;

/**
 * Used for mocking Health_Check implementations. This is required because implementations of a health check have to set a health check runner to function.
 */
class Health_Check_Double extends Health_Check {

	public function __construct( Runner_Interface $runner ) {
		parent::set_runner( $runner );
	}

	protected function get_result() {
		return [];
	}

	public function get_test_label() {
		return '';
	}
}
