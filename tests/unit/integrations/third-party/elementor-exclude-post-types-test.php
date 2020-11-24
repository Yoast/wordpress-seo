<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Third_Party\Elementor_Exclude_Post_Types;

/**
 * Class Elementor_Exclude_Post_Types_Test.
 *
 * @group integrations
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Elementor_Exclude_Post_Types
 */
class Elementor_Exclude_Post_Types_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Exclude_Post_Types
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Elementor_Exclude_Post_Types();
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
			Elementor_Exclude_Post_Types::get_conditionals()
		);
	}

	/**
	 * Tests that the integration is correctly hooked into
	 * the `wpseo_indexable_excluded_post_types` hook.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_indexable_excluded_post_types' )
			->with( [ $this->instance, 'exclude_elementor_post_types' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the correct post types are excluded.
	 *
	 * @covers ::exclude_elementor_post_types
	 */
	public function test_exclude_elementor_post_types() {
		$excluded_post_types = [];

		$expected = [
			'elementor_library',
			'oembed_cache',
		];
		$actual   = $this->instance->exclude_elementor_post_types( $excluded_post_types );


		self::assertEquals( $expected, $actual );
	}
}
