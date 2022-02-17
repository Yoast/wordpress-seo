<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Services\Health_Check\Curl_Runner;

/**
 * Curl_Runner
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Curl_Runner
 */
class Curl_Runner_Test extends TestCase {

	/**
	 * The Curl_Runner instance to be tested.
	 *
	 * @var Curl_Runner
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Curl_Runner();
	}

	/**
	 * Checks if the health check succeeds when something other than the default WordPress tagline is set.
	 *
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_returns_early_when_no_curl_is_installed() {
		Monkey\Functions\expect( 'function_exists' )
			->once()
			->with( 'curl_version' )
			->andReturn( false );

		$this->assertFalse( $this->instance->has_recent_curl_version_installed() );
		$this->assertFalse( $this->instance->can_reach_my_yoast_api() );
		$this->assertFalse( $this->instance->is_successful() );
	}
}
