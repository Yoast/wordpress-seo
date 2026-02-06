<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

use Brain\Monkey\Functions;
use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

/**
 * Tests the add_notifications method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::add_notifications
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::has_notification_been_resolved
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::get_schema_aggregator_indexables_disabled_notification
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::get_message
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Add_Notifications_Test extends Abstract_Schema_Aggregator_Indexables_Disabled_Alert_Test {

	/**
	 * Tests the add_notifications method.
	 *
	 * @dataProvider add_notifications_data
	 *
	 * @param bool   $is_met                 The return value for is_met.
	 * @param int    $get_meta_times         The number of times get_meta should be called.
	 * @param string $get_meta_return        The return value for get_meta.
	 * @param int    $should_index_times     The number of times should_index_indexables should be called.
	 * @param bool   $should_index_return    The return value for should_index_indexables.
	 * @param int    $short_link_times       The number of times short_link_helper->get should be called.
	 * @param int    $add_notification_times The number of times add_notification should be called.
	 *
	 * @return void
	 */
	public function test_add_notifications(
		bool $is_met,
		int $get_meta_times,
		string $get_meta_return,
		int $should_index_times,
		bool $should_index_return,
		int $short_link_times,
		int $add_notification_times
	): void {
		Functions\expect( 'get_current_user_id' )
			->andReturn( 1 );

		Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-resolve-alert-nonce' )
			->andReturn( 'nonce_value' );

		$this->schema_aggregator_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( $is_met );

		$this->user_helper
			->expects( 'get_meta' )
			->times( $get_meta_times )
			->with( 1, Schema_Aggregator_Indexables_Disabled_Alert::NOTIFICATION_ID . '_resolved', true )
			->andReturn( $get_meta_return );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->times( $should_index_times )
			->andReturn( $should_index_return );

		$this->short_link_helper
			->expects( 'get' )
			->times( $short_link_times )
			->with( 'https://yoa.st/schema-aggregation-alert/' )
			->andReturn( 'https://yoa.st/schema-aggregation-alert/' );

		$this->notification_center
			->expects( 'add_notification' )
			->times( $add_notification_times );

		$this->instance->add_notifications();
	}

	/**
	 * Data provider for test_add_notifications.
	 *
	 * @return Generator
	 */
	public static function add_notifications_data() {
		yield 'Schema aggregator conditional is not met' => [
			'is_met'                 => false,
			'get_meta_times'         => 0,
			'get_meta_return'        => '',
			'should_index_times'     => 0,
			'should_index_return'    => false,
			'short_link_times'       => 0,
			'add_notification_times' => 0,
		];

		yield 'Notification has been resolved' => [
			'is_met'                 => true,
			'get_meta_times'         => 1,
			'get_meta_return'        => '1',
			'should_index_times'     => 0,
			'should_index_return'    => false,
			'short_link_times'       => 0,
			'add_notification_times' => 0,
		];

		yield 'Indexables should be indexed' => [
			'is_met'                 => true,
			'get_meta_times'         => 1,
			'get_meta_return'        => '',
			'should_index_times'     => 1,
			'should_index_return'    => true,
			'short_link_times'       => 0,
			'add_notification_times' => 0,
		];

		yield 'Notification gets added' => [
			'is_met'                 => true,
			'get_meta_times'         => 1,
			'get_meta_return'        => '',
			'should_index_times'     => 1,
			'should_index_return'    => false,
			'short_link_times'       => 1,
			'add_notification_times' => 1,
		];
	}
}
