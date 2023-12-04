<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Exclude_Elementor_Post_Types_Test.
 *
 * @group integrations
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types
 */
class Exclude_Elementor_Post_Types_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Exclude_Elementor_Post_Types
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Exclude_Elementor_Post_Types();
	}

	/**
	 * Tests that the integration is only active when
	 * the Elementor plugin is installed and activated.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		self::assertEquals(
			[ Elementor_Activated_Conditional::class ],
			Exclude_Elementor_Post_Types::get_conditionals()
		);
	}

	/**
	 * Tests that the correct post types are excluded.
	 *
	 * @covers ::exclude_post_types
	 */
	public function test_exclude_elementor_post_types() {
		$excluded_post_types = [];

		$expected = [ 'elementor_library' ];
		$actual   = $this->instance->exclude_post_types( $excluded_post_types );

		self::assertEquals( $expected, $actual );
	}
}
