<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Helpers\Attachment_Cleanup_Helper;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher;


/**
 * Class Indexable_Attachment_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher
 * @covers Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher
 */
class Indexable_Attachment_Watcher_Test extends TestCase {

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * The attachment cleanup helper.
	 *
	 * @var Attachment_Cleanup_Helper
	 */
	protected $attachment_cleanup;

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The Indexable_Attachment_Watcher instance.
	 *
	 * @var Indexable_Attachment_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->attachment_cleanup  = Mockery::mock( Attachment_Cleanup_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexable_Attachment_Watcher(
			$this->indexing_helper,
			$this->attachment_cleanup,
			$this->notification_center
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertSame( [ Migrations_Conditional::class ], $this->instance->get_conditionals() );
	}

	/**
	 * Tests the register_hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {

		Monkey\Actions\expectAdded( 'update_option_wpseo_titles' )
			->with( [ $this->instance, 'check_option' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Data provider for test_check_option.
	 *
	 * @return array $old_value,$new_value, $delete_transient_times, $set_reason_times, $attachment_cleanup_times, wp_next_scheduled, $schedule_event_times.
	 */
	public function check_option_provider() {
		return [
			[ 1, 2, 0, 0, 0, null, 0 ],
			[ [ 'test' => 'test' ], [ 'test' => 'test' ], 0, 0, 0, null, 0 ],
			[ false, [ 'test' => 'test' ], 0, 0, 0, null, 0 ],
			[ [ 'disable-attachment' => true ], [ 'disable-attachment' => false ], 1, 1, 0, null, 0 ],
			[ [ 'disable-attachment' => false ], [ 'disable-attachment' => true ], 1, 0, 1, true, 0 ],
			[ [ 'disable-attachment' => false ], [ 'disable-attachment' => true ], 1, 0, 1, false, 1 ],
		];
	}

	/**
	 * Tests the check_option method.
	 *
	 * @covers ::check_option
	 *
	 * @dataProvider check_option_provider
	 *
	 * @param array|bool $old_value The old value.
	 * @param array|bool $new_value The new value.
	 * @param int        $delete_transient_times Whether to delete the transient.
	 * @param int        $set_reason_times Whether to set the reason.
	 * @param int        $attachment_cleanup_times Whether to clean up the attachment.
	 * @param bool       $wp_next_scheduled Whether to schedule the cleanup.
	 * @param int        $schedule_event_times Whether to schedule the cleanup.
	 */
	public function test_check_option( $old_value, $new_value, $delete_transient_times, $set_reason_times, $attachment_cleanup_times, $wp_next_scheduled, $schedule_event_times ) {

		Monkey\Functions\expect( 'delete_transient' )
			->with( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT )
			->times( $delete_transient_times );

		Monkey\Functions\expect( 'delete_transient' )
			->with( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT )
			->times( $delete_transient_times );

		$this->indexing_helper
			->expects( 'set_reason' )
			->with( Indexing_Reasons::REASON_ATTACHMENTS_MADE_ENABLED )
			->times( $set_reason_times );

		$this->attachment_cleanup
			->expects( 'remove_attachment_indexables' )
			->with( false )
			->times( $attachment_cleanup_times );

		$this->attachment_cleanup
			->expects( 'clean_attachment_links_from_target_indexable_ids' )
			->with( false )
			->times( $attachment_cleanup_times );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->with( Cleanup_Integration::START_HOOK )
			->times( $attachment_cleanup_times )
			->andReturn( $wp_next_scheduled );

			Monkey\Functions\expect( 'wp_schedule_single_event' )
				->with( ( time() + ( \MINUTE_IN_SECONDS * 5 ) ), Cleanup_Integration::START_HOOK )
				->times( $schedule_event_times );

		$this->instance->check_option( $old_value, $new_value );
	}
}
