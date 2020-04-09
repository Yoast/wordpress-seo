<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Tests\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Jetpack_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Jetpack;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Jetpack
 * @covers ::<!public>
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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Jetpack();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class, Jetpack_Conditional::class, Open_Graph_Conditional::class, Migrations_Conditional::class ],
			Jetpack::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks with breadcrumbs disabled..
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_with_breadcrumbs_disabled() {
		$this->instance->register_hooks();

		$this->assertTrue( \has_filter( 'jetpack_enable_open_graph', '__return_false' ) );
	}
}
