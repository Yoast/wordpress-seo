<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\WP_CRON_Enabled_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WP_CRON_Enabled_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\WP_CRON_Enabled_Conditional
 */
final class WP_CRON_Enabled_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var WP_CRON_Enabled_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WP_CRON_Enabled_Conditional();
	}

	/**
	 * Tests that the condition is met when there is no DISABLE_WP_CRON define.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the condition is not met when there is a true DISABLE_WP_CRON define.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		if ( ! \defined( 'DISABLE_WP_CRON' ) ) {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WP constant used in a test.
			\define( 'DISABLE_WP_CRON', true );
		}
		$this->assertFalse( $this->instance->is_met() );
	}
}
