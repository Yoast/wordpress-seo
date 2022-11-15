<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey\Functions;
use Mockery;
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

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

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
	 * Tests checking if one or more taxonomies change visibility.
	 *
	 * @dataProvider provider_check_taxonomy_public_availability
	 *
	 * @covers ::check_taxonomy_public_availability
	 *
	 * @param bool  $is_json_request              Whether it's a JSON request.
	 * @param array $public_taxonomies            The public taxonomies.
	 * @param int   $get_public_taxonomies_times  The times we get the public taxonomies.
	 * @param array $last_known_public_taxonomies The last known public taxonomies.
	 * @param int   $set_public_taxonomies_times  The times we get the last known public taxonomies.
	 * @param int   $delete_transient_times       The times we delete the transients.
	 * @param int   $schedule_cleanup_times       The times we schedule cleanup.
	 */
	public function test_check_taxonomy_public_availability(
		$is_json_request, $public_taxonomies, $get_public_taxonomies_times, $last_known_public_taxonomies, $set_public_taxonomies_times, $delete_transient_times, $schedule_cleanup_times
	) {
		Functions\expect( 'wp_is_json_request' )
			->once()
			->andReturn( $is_json_request );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->times( $get_public_taxonomies_times )
			->andReturn( $public_taxonomies );

		$this->options
			->expects( 'get' )
			->times( $get_public_taxonomies_times )
			->with( 'last_known_public_taxonomies', [] )
			->andReturn( $last_known_public_taxonomies );

		$this->options
			->expects( 'set' )
			->times( $set_public_taxonomies_times )
			->with( 'last_known_public_taxonomies', \array_keys( $public_taxonomies ) );

		Functions\expect( 'delete_transient' )
			->times( $delete_transient_times )
			->with( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );

		Functions\expect( 'delete_transient' )
			->times( $delete_transient_times )
			->andReturn( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

		$this->indexing_helper
			->expects( 'set_reason' )
			->times( $delete_transient_times )
			->with( Indexing_Reasons::REASON_TAXONOMY_MADE_PUBLIC );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->times( $delete_transient_times )
			->with( 'taxonomies-made-public' )
			->andReturn( 'not_null' );

		Functions\expect( 'wp_next_scheduled' )
			->times( $schedule_cleanup_times )
			->with( Cleanup_Integration::START_HOOK )
			->andReturn( false );

		Functions\expect( 'wp_schedule_single_event' )
			->times( $schedule_cleanup_times );

		$this->instance->check_taxonomy_public_availability();
	}

	/**
	 * Data provider for test_check_taxonomy_public_availability().
	 *
	 * @return array
	 */
	public function provider_check_taxonomy_public_availability() {

		return [
			[ true, [ 'irrelevant' ], 0, [ 'irrelevant' ], 0, 0, 0 ],
			[ false, [], 1, [], 1, 0, 0 ],
			[
				false,
				[
					'category' => 'category',
					'post_tag' => 'post_tag',
				],
				1,
				[
					'category' => 'category',
					'post_tag' => 'post_tag',
				],
				0,
				0,
				0,
			],
			[
				false,
				[
					'category' => 'category',
					'post_tag' => 'post_tag',
				],
				1,
				[
					'category' => 'category',
				],
				1,
				1,
				0,
			],
			[
				false,
				[
					'category' => 'category',
				],
				1,
				[
					'category' => 'category',
					'post_tag' => 'post_tag',
				],
				1,
				0,
				1,
			],
		];
	}
}
