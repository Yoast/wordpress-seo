<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Option_Titles_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Titles_Watcher
 */
final class Option_Titles_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Option_Titles_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Option_Titles_Watcher();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Option_Titles_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests with the old value being false. This is the case when the option is
	 * saved the first time.
	 *
	 * @covers ::check_option
	 * @covers ::get_relevant_keys
	 * @covers ::delete_ancestors
	 *
	 * @return void
	 */
	public function test_check_option_with_old_value_being_false() {
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturn( [ 'post' ] );

		$this->assertFalse( $this->instance->check_option( false, [] ) );
	}

	/**
	 * Tests the method with having one argument not being an array.
	 *
	 * @covers ::check_option
	 *
	 * @return void
	 */
	public function test_check_option_with_one_value_not_being_an_array() {
		$this->assertFalse( $this->instance->check_option( 'string', [] ) );
	}

	/**
	 * Tests the method with having no public post types.
	 *
	 * @covers ::check_option
	 * @covers ::get_relevant_keys
	 *
	 * @return void
	 */
	public function test_check_option_with_no_public_post_types() {
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturn( [] );

		$this->assertFalse( $this->instance->check_option( [], [] ) );
	}

	/**
	 * Tests the method with having the get_post_types returning null instead of an
	 * array.
	 *
	 * @covers ::check_option
	 * @covers ::get_relevant_keys
	 *
	 * @return void
	 */
	public function test_check_option_with_get_post_types_return_non_array() {
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturnNull();

		$this->assertFalse( $this->instance->check_option( [], [] ) );
	}

	/**
	 * Tests the method with the ancestors being removed.
	 *
	 * @covers ::check_option
	 * @covers ::get_relevant_keys
	 * @covers ::delete_ancestors
	 *
	 * @return void
	 */
	public function test_check_option_with_ancestors_being_removed() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'prepare' )
			->once()
			->with(
				"
				DELETE FROM %i
				WHERE indexable_id IN(
					SELECT id
					FROM %i
					WHERE object_type = 'post'
					AND object_sub_type IN( %s )
				)",
				'wp_yoast_indexable_hierarchy',
				'wp_yoast_indexable',
				'post'
			)
			->andReturn(
				"
				DELETE FROM `wp_yoast_indexable_hierarchy`
				WHERE indexable_id IN(
					SELECT id
					FROM `wp_yoast_indexable`
					WHERE object_type = 'post'
					AND object_sub_type IN( post )
				)"
			);

		$wpdb
			->expects( 'query' )
			->once()
			->with(
				"
				DELETE FROM `wp_yoast_indexable_hierarchy`
				WHERE indexable_id IN(
					SELECT id
					FROM `wp_yoast_indexable`
					WHERE object_type = 'post'
					AND object_sub_type IN( post )
				)"
			)
			->andReturn( 2 );

		$GLOBALS['wpdb'] = $wpdb;

		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturn( [ 'post' ] );

		$this->assertTrue(
			$this->instance->check_option(
				[
					'post_types-post-maintax' => 0,
				],
				[
					'post_types-post-maintax' => 1,
				]
			)
		);
	}

	/**
	 * Tests the method with having the ancestors not being removed because the
	 * database object returns false indicating that something went wrong.
	 *
	 * @covers ::check_option
	 * @covers ::get_relevant_keys
	 * @covers ::delete_ancestors
	 *
	 * @return void
	 */
	public function test_check_option_with_ancestors_not_being_removed() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'prepare' )
			->once()
			->with(
				"
				DELETE FROM %i
				WHERE indexable_id IN(
					SELECT id
					FROM %i
					WHERE object_type = 'post'
					AND object_sub_type IN( %s )
				)",
				'wp_yoast_indexable_hierarchy',
				'wp_yoast_indexable',
				'post'
			)
			->andReturn( 'the query' );

		$wpdb
			->expects( 'query' )
			->once()
			->with( 'the query' )
			->andReturnFalse();

		$GLOBALS['wpdb'] = $wpdb;

		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'public' => true ], 'names' )
			->andReturn( [ 'post' ] );

		$this->assertFalse(
			$this->instance->check_option(
				[
					'post_types-post-maintax' => 0,
				],
				[
					'post_types-post-maintax' => 1,
				]
			)
		);
	}
}
