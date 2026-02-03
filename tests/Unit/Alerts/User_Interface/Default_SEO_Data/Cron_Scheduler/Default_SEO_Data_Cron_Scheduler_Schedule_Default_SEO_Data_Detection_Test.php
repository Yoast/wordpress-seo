<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Cron_Scheduler;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the schedule_default_seo_data_detection method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_Seo_Data\Default_SEO_Data_Cron_Scheduler::schedule_default_seo_data_detection
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Cron_Scheduler_Schedule_Default_SEO_Data_Detection_Test extends Abstract_Default_SEO_Data_Cron_Scheduler_Test {

	/**
	 * Tests the schedule_default_seo_data_detection method.
	 *
	 * @dataProvider schedule_default_seo_data_detection_provider
	 *
	 * @param bool $wp_next_scheduled_result The result of wp_next_scheduled.
	 * @param int  $wp_schedule_event_times  The number of times wp_schedule_event should be called.
	 *
	 * @return void
	 */
	public function test_schedule_default_seo_data_detection(
		$wp_next_scheduled_result,
		$wp_schedule_event_times
	) {
		Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( 'wpseo_detect_default_seo_data' )
			->andReturn( $wp_next_scheduled_result );

		Functions\expect( 'wp_schedule_event' )
			->times( $wp_schedule_event_times );

		$this->instance->schedule_default_seo_data_detection();
	}

	/**
	 * Data provider for the test_schedule_default_seo_data_detection test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function schedule_default_seo_data_detection_provider() {
		yield 'Cron already scheduled - do not schedule again' => [
			'wp_next_scheduled_result' => 1234567890,
			'wp_schedule_event_times'  => 0,
		];

		yield 'Cron not scheduled - schedule it' => [
			'wp_next_scheduled_result' => false,
			'wp_schedule_event_times'  => 1,
		];
	}
}
