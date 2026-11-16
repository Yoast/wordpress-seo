<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Local_SEO_Active_Conditional test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional
 */
final class Local_SEO_Active_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Local_SEO_Active_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Local_SEO_Active_Conditional();
	}

	/**
	 * Tests that the conditional is not met when Yoast Local SEO is not loaded.
	 *
	 * The met case is not tested, as defining the constant would leak into every following test.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		$this->assertFalse( $this->instance->is_met() );
	}
}
