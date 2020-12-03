<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Exclude_Oembed_Cache_Post_Type;

/**
 * Class Exclude_Oembed_Cache_Post_Type_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Exclude_Oembed_Cache_Post_Type
 */
class Exclude_Oembed_Cache_Post_Type_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Exclude_Oembed_Cache_Post_Type
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->instance = new Exclude_Oembed_Cache_Post_Type();
	}

	/**
	 * Tests that the right hooks are being registered
	 * for the integration to work.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_indexable_excluded_post_types' )
			->once()
			->with( [ $this->instance, 'exclude_oembed_cache_post_type' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the integration is loaded when the
	 * database migrations have run.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		self::assertEquals( [ Migrations_Conditional::class ], Exclude_Oembed_Cache_Post_Type::get_conditionals() );
	}

	/**
	 * Tests that the integration excludes the `oembed_cache` post type
	 * from being indexed.
	 *
	 * @covers ::exclude_oembed_cache_post_type
	 */
	public function test_exclude_oembed_cache_post_type() {
		$actual = $this->instance->exclude_oembed_cache_post_type( [ 'other_excluded_post_type' ] );
		self::assertEquals( [ 'other_excluded_post_type', 'oembed_cache' ], $actual );
	}
}
