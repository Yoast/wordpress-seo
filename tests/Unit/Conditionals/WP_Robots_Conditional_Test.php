<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\WP_Robots_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Web_Stories_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\WP_Robots_Conditional
 */
class WP_Robots_Conditional_Test extends TestCase {

	/**
	 * Represents the insstance to test.
	 *
	 * @var WP_Robots_Conditional
	 */
	protected $instance;

	/**
	 * Handles the setup.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WP_Robots_Conditional();
	}

	/**
	 * Tests the scenario where the wp_robots isn't present.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_without_having_wp_robots_function() {
		static::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests the scenario where the wp_robots isn't present.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'wp_robots' )->never();

		static::assertTrue( $this->instance->is_met() );
	}
}
