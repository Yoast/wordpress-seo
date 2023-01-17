<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Change_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

use WP_Post_Type;
/**
 * Class Indexable_Post_Type_Change_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Change_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Change_Watcher
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Post_Type_Change_Watcher_Test extends TestCase {

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
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Post_Type_Change_Watcher
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options             = Mockery::mock( Options_Helper::class );
		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->post_type_helper    = Mockery::mock( Post_Type_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexable_Post_Type_Change_Watcher(
			$this->options,
			$this->indexing_helper,
			$this->post_type_helper,
			$this->notification_center
		);
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
			Indexable_Post_Type_Change_Watcher::get_conditionals()
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
		$this->assertNotFalse( \has_action( 'admin_init', [ $this->instance, 'check_post_types_public_availability' ] ) );
	}

	/**
	 * Tests checking post types change visibility when a post type is added/made public.
	 *
	 * @covers ::check_post_types_public_availability
	 */
	public function test_check_post_types_public_availability_new_post_type_added() {
		$post_type            = Mockery::mock( WP_Post_Type::class )->makePartial();
		$post_type->name      = 'test';
		$post_type->rewrite   = 'test_rewrite';
		$post_type->rest_base = 'test_route';

		$indexable_post_type_objects[] = $post_type;

		$post_type            = Mockery::mock( WP_Post_Type::class )->makePartial();
		$post_type->name      = 'test2';
		$post_type->rewrite   = 'test_rewrite2';
		$post_type->rest_base = 'test_route2';

		$indexable_post_type_objects[] = $post_type;

		Functions\expect( 'wp_is_json_request' )
			->once()
			->andReturn( false );

		$this->post_type_helper
			->expects( 'get_indexable_post_type_objects' )
			->once()
			->andReturn( $indexable_post_type_objects );

		$this->post_type_helper
			->expects( 'get_post_type_route' )
			->times( 2 )
			->andReturn( 'test_route', 'test_route2' );

		$this->post_type_helper
			->expects( 'get_post_type_label' )
			->times( 2 )
			->andReturn( 'test_label', 'test_label2' );

		$this->options
			->expects( 'get' )
			->times( 1 )
			->with( 'last_known_public_post_types', [] )
			->andReturn( [ 'test_route' => 'test' ] );

		$this->options
			->expects( 'set' )
			->times( 1 )
			->with(
				'last_known_public_post_types',
				[
					'test_route'  => 'test_label',
					'test_route2' => 'test_label2',
				]
			);

		Functions\expect( 'delete_transient' )
			->times( 1 )
			->with( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );

		Functions\expect( 'delete_transient' )
			->times( 1 )
			->andReturn( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

		$this->indexing_helper
			->expects( 'set_reason' )
			->times( 1 )
			->with( Indexing_Reasons::REASON_POST_TYPE_MADE_PUBLIC );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->times( 1 )
			->with( 'post-type-made-public-test_route2' )
			->andReturn( 'not_null' );

		$this->instance->check_post_types_public_availability();
	}

	/**
	 * Tests checking post type change visibility when a post type is removed/made non public.
	 *
	 * @covers ::check_post_types_public_availability
	 */
	public function test_check_post_types_public_availability_post_type_removed() {
		$post_type            = Mockery::mock( WP_Post_Type::class )->makePartial();
		$post_type->name      = 'test';
		$post_type->rewrite   = 'test_rewrite';
		$post_type->rest_base = 'test_route';

		$indexable_post_type_objects[] = $post_type;

		Functions\expect( 'wp_is_json_request' )
			->once()
			->andReturn( false );

		$this->post_type_helper
			->expects( 'get_indexable_post_type_objects' )
			->once()
			->andReturn( $indexable_post_type_objects );

		$this->post_type_helper
			->expects( 'get_post_type_route' )
			->once()
			->andReturn( 'test_route' );

		$this->post_type_helper
			->expects( 'get_post_type_label' )
			->once()
			->andReturn( 'test_label' );

		$this->options
			->expects( 'get' )
			->times( 1 )
			->with( 'last_known_public_post_types', [] )
			->andReturn(
				[
					'test_route'  => 'test',
					'test_route2' => 'test2',
				]
			);

		$this->options
			->expects( 'set' )
			->times( 1 )
			->with( 'last_known_public_post_types', [ 'test_route' => 'test_label' ] );

		Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( Cleanup_Integration::START_HOOK )
			->andReturn( false );

		Functions\expect( 'wp_schedule_single_event' )
			->once();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( 'post-type-made-public-test_route2' );

		$this->instance->check_post_types_public_availability();
	}
}
