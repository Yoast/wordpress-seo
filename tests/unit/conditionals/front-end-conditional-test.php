<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Front_End_Conditional class.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Front_End_Conditional
 */
class Front_End_Conditional_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Front_End_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Front_End_Conditional();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Front_End_Conditional::class, $this->instance );
	}

	/**
	 * Tests that the conditional is met when is_admin is false.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		// Via stubs is needed because TestCase stubs it.
		Monkey\Functions\stubs( [ 'is_admin' => false ] );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when is_admin is true.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		// Via stubs is needed because TestCase stubs it.
		Monkey\Functions\stubs( [ 'is_admin' => true ] );

		$this->assertFalse( $this->instance->is_met() );
	}
}
