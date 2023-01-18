<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
use WP_Taxonomy;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Taxonomy_Change_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Taxonomy_Change_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Taxonomy_Change_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Taxonomy_Change_Watcher
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Taxonomy_Change_Watcher_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Holds the Taxonomy_Helper instance.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Taxonomy_Change_Watcher
	 */
	private $instance;

	/*
	 * Holds the taxonomies array.
	 *
	 * @var array
	 */
	private $taxonomies_array;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->options             = Mockery::mock( Options_Helper::class );
		$this->taxonomy_helper     = Mockery::mock( Taxonomy_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexable_Taxonomy_Change_Watcher(
			$this->indexing_helper,
			$this->options,
			$this->taxonomy_helper,
			$this->notification_center
		);

		$taxonomy            = Mockery::mock( WP_Taxonomy::class );
		$taxonomy->name      = 'test';
		$taxonomy->rewrite   = 'test_rewrite';
		$taxonomy->rest_base = 'test_route';

		$this->taxonomies_array[] = $taxonomy;

		$taxonomy            = Mockery::mock( WP_Taxonomy::class );
		$taxonomy->name      = 'test2';
		$taxonomy->rewrite   = 'test_rewrite2';
		$taxonomy->rest_base = 'test_route2';

		$this->taxonomies_array[] = $taxonomy;
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Not_Admin_Ajax_Conditional::class,
				Admin_Conditional::class,
				Migrations_Conditional::class,
			],
			Indexable_Taxonomy_Change_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( \has_action( 'admin_init', [ $this->instance, 'check_taxonomy_public_availability' ] ) );
	}

	/**
	 * Tests checking taxonomy change visibility when a taxonomy is added/made public.
	 *
	 * @covers ::check_taxonomy_public_availability
	 */
	public function test_check_taxonomy_public_availability_new_taxonomy_added() {
		Functions\expect( 'wp_is_json_request' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'get_indexable_taxonomy_objects' )
			->once()
			->andReturn( $this->taxonomies_array );

		$this->taxonomy_helper
			->expects( 'get_taxonomy_route' )
			->times( 2 )
			->andReturn( 'test_route', 'test_route2' );

		$this->taxonomy_helper
			->expects( 'get_taxonomy_label' )
			->times( 2 )
			->andReturn( 'test_label', 'test_label2' );

		$this->options
			->expects( 'get' )
			->times( 1 )
			->with( 'last_known_public_taxonomies', [] )
			->andReturn( [ 'test_route' => 'test' ] );

		$this->options
			->expects( 'set' )
			->times( 1 )
			->with(
				'last_known_public_taxonomies',
				[
					'test_route'  => 'test_label',
					'test_route2' => 'test_label2',
				]
			);

		Functions\expect( 'delete_transient' )
			->times( 1 )
			->with( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );

		Functions\expect( 'delete_transient' )
			->times( 1 )
			->andReturn( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

		$this->indexing_helper
			->expects( 'set_reason' )
			->times( 1 )
			->with( Indexing_Reasons::REASON_TAXONOMY_MADE_PUBLIC );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->times( 1 )
			->with( 'taxonomy-made-public-test_route2' )
			->andReturn( 'not_null' );

		$this->instance->check_taxonomy_public_availability();
	}

		/**
		 * Tests checking taxonomy change visibility when a taxonomy is removed/made non public.
		 *
		 * @covers ::check_taxonomy_public_availability
		 */
	public function test_check_taxonomy_public_availability_taxonomy_removed() {
		Functions\expect( 'wp_is_json_request' )
			->once()
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'get_indexable_taxonomy_objects' )
			->once()
			->andReturn( \array_slice( $this->taxonomies_array, 0, 1 ) );

		$this->taxonomy_helper
			->expects( 'get_taxonomy_route' )
			->once()
			->andReturn( 'test_route' );

		$this->taxonomy_helper
			->expects( 'get_taxonomy_label' )
			->once()
			->andReturn( 'test_label' );

		$this->options
			->expects( 'get' )
			->times( 1 )
			->with( 'last_known_public_taxonomies', [] )
			->andReturn(
				[
					'test_route'  => 'test',
					'test_route2' => 'test2',
				]
			);

		$this->options
			->expects( 'set' )
			->times( 1 )
			->with( 'last_known_public_taxonomies', [ 'test_route' => 'test_label' ] );

		Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Cleanup_Integration::START_HOOK )
			->andReturn( false );

		Functions\expect( 'wp_schedule_single_event' )
			->once();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( 'taxonomy-made-public-test_route2' );

		$this->instance->check_taxonomy_public_availability();
	}
}
