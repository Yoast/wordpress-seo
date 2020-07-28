<?php

namespace Yoast\WP\SEO\Tests\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Cron_Conditional;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Cron_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Cron_Conditional
 */
class Cron_Conditional_Test extends TestCase {

	/**
	 * The conditional.
	 *
	 * @var Cron_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Cron_Conditional();
	}

	/**
	 * Tests that the conditional is met.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'wp_doing_cron' )
			->once()
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		Monkey\Functions\expect( 'wp_doing_cron' )
			->once()
			->andReturnFalse();

		$this->assertFalse( $this->instance->is_met() );
	}
}
