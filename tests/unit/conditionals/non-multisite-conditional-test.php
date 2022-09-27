<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Non_Multisite_Conditional test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional
 */
class Non_Multisite_Conditional_Test extends TestCase {

	/**
	 * The schema blocks feature flag conditional.
	 *
	 * @var Non_Multisite_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Non_Multisite_Conditional();
	}

	/**
	 * Tests whether the conditional is not met when we are in a multisite setup.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		Monkey\Functions\stubs(
			[
				'is_multisite'   => true,
			]
		);
		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests whether the conditional is met when we are not in a multisite setup.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\stubs(
			[
				'is_multisite'   => false,
			]
		);

		self::assertTrue( $this->instance->is_met() );
	}
}
