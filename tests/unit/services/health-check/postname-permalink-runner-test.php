<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Yoast\WP\SEO\Services\Health_Check\Postname_Permalink_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Postname_Permalink_Runner_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Postname_Permalink_Runner
 */
class Postname_Permalink_Runner_Test extends TestCase {

	/**
	 * The Postname_Permalink_Runner instance to be tested.
	 *
	 * @var Postname_Permalink_Runner
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Postname_Permalink_Runner();
	}

	/**
	 * Checks if the health check succeeds when something other than the default WordPress tagline is set.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_returns_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '%postname%' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertTrue( $actual );
	}

	/**
	 * Checks if the health check fails when the default WordPress tagline is set.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::is_successful
	 */
	public function test_retuns_not_successful() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( 'something-else' );

		$this->instance->run();
		$actual = $this->instance->is_successful();

		$this->assertFalse( $actual );
	}
}
