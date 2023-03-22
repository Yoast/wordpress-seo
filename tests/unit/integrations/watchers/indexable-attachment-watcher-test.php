<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Attachment_Cleanup_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Attachment_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Attachment_Watcher
 */
class Indexable_Attachment_Watcher_Test extends TestCase {

	/**
	 * Represents the indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Represents the attachment cleanup helper.
	 *
	 * @var Mockery\MockInterface|Attachment_Cleanup_Helper
	 */
	protected $attachment_cleanup;

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Attachment_Watcher
	 */
	private $instance;

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
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests the check_option method.
	 *
	 * @dataProvider provider_get_unindexed
	 * @covers ::check_option
	 *
	 * @param array $old_value                   The old value of the wpseo_title option.
	 * @param array $new_value                   The new value of the wpseo_title option.
	 * @param int   $set_reason_times            The times a reason for indexing will be set.
	 * @param int   $cleanups_times              The times cleanups will be performed.
	 * @param int   $delete_transients_times     The times transients will be deleted.
	 * @param int   $get_next_scheduled_times    The times we'll check if there's a scheduled action.
	 * @param bool  $is_next_scheduled           Whether a scheduled action exists.
	 * @param int   $schedule_single_event_times The times we'll schedule a single event.
	 */
	public function test_check_option( $old_value, $new_value, $set_reason_times, $cleanups_times, $delete_transients_times, $get_next_scheduled_times, $is_next_scheduled, $schedule_single_event_times ) {
		$this->indexing_helper
			->expects( 'set_reason' )
			->with( Indexing_Reasons::REASON_ATTACHMENTS_MADE_ENABLED )
			->times( $set_reason_times );

		$this->attachment_cleanup
			->expects( 'remove_attachment_indexables' )
			->with( false )
			->times( $cleanups_times );

		$this->attachment_cleanup
			->expects( 'clean_attachment_links_from_target_indexable_ids' )
			->with( false )
			->times( $cleanups_times );

		Monkey\Functions\expect( 'delete_transient' )
			->with( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT )
			->times( $delete_transients_times );

		Monkey\Functions\expect( 'delete_transient' )
			->with( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT )
			->times( $delete_transients_times );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->with( Cleanup_Integration::START_HOOK )
			->times( $get_next_scheduled_times )
			->andReturn( $is_next_scheduled );

		Monkey\Functions\expect( 'wp_schedule_single_event' )
			->times( $schedule_single_event_times )
			->andReturnTrue();

		$this->instance->check_option( $old_value, $new_value );
	}

	/**
	 * Data provider for test_get_total_unindexed() and test_get_limited_unindexed_count().
	 *
	 * @return array
	 */
	public function provider_get_unindexed() {
		$options_with_no_key_set          = [
			'not_disable-attachment' => 'irrelevant',
		];
		$options_with_disabled_attachment = [
			'disable-attachment' => true,
		];
		$options_with_enabled_attachment  = [
			'disable-attachment' => false,
		];

		return [
			[ false, [ 'irrelevant' ], 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ 'not_array', [ 'irrelevant' ], 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ [ 'irrelevant' ], 'not_array', 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ $values_with_no_key_set, [ 'irrelevant' ], 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ $options_with_disabled_attachment, $options_with_disabled_attachment, 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ $options_with_enabled_attachment, $options_with_enabled_attachment, 0, 0, 0, 0, 'irrelevant,', 0 ],
			[ $options_with_disabled_attachment, $options_with_enabled_attachment, 1, 0, 1, 0, 'irrelevant,', 0 ],
			[ $options_with_enabled_attachment, $options_with_disabled_attachment, 0, 1, 1, 1, false, 1 ],
			[ $options_with_enabled_attachment, $options_with_disabled_attachment, 0, 1, 1, 1, true, 0 ],
		];
	}
}
