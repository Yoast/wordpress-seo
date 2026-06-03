<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Integrations\Estimated_Reading_Time;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for testing the estimated reading time integration.
 *
 * @group estimated-reading-time
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Estimated_Reading_Time
 */
final class Estimated_Reading_Time_Test extends TestCase {

	/**
	 * The class to test.
	 *
	 * @var Estimated_Reading_Time
	 */
	protected $instance;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Estimated_Reading_Time();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		// No hooks are registered; the field is declared in WPSEO_Meta::$meta_fields.
		$this->instance->register_hooks();
		$this->assertTrue( true );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Estimated_Reading_Time_Conditional::class ],
			Estimated_Reading_Time::get_conditionals(),
		);
	}
}
