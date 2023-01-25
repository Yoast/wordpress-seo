<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Jetpack_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Jetpack;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Jetpack_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Jetpack
 *
 * @group integrations
 * @group third-party
 */
class Jetpack_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Jetpack
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Jetpack();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class, Jetpack_Conditional::class, Open_Graph_Conditional::class ],
			Jetpack::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'jetpack_enable_open_graph', '__return_false' ) );
	}
}
