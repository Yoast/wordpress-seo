<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abilities_API_Conditional class.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Abilities_API_Conditional
 */
final class Abilities_API_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Abilities_API_Conditional
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Abilities_API_Conditional();
	}

	/**
	 * Tests that is_met returns true for WordPress 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_true_for_6_9() {
		Monkey\Functions\expect( 'wp_get_wp_version' )
			->once()
			->andReturn( '6.9' );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that is_met returns true for WordPress versions above 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_true_for_above_6_9() {
		Monkey\Functions\expect( 'wp_get_wp_version' )
			->once()
			->andReturn( '7.0' );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that is_met returns false for WordPress versions below 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_false_for_below_6_9() {
		Monkey\Functions\expect( 'wp_get_wp_version' )
			->once()
			->andReturn( '6.8.1' );

		$this->assertFalse( $this->instance->is_met() );
	}
}
