<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the unschedule_default_seo_data_detection method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_Seo_Data\Default_SEO_Data_Cron_Scheduler::unschedule_default_seo_data_detection
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Cron_Scheduler_Unschedule_Default_SEO_Data_Detection_Test extends Abstract_Default_SEO_Data_Cron_Scheduler_Test {

	/**
	 * Tests the unschedule_default_seo_data_detection method.
	 *
	 * @dataProvider unschedule_default_seo_data_detection_provider
	 *
	 * @param int|false $wp_next_scheduled_result  The result of wp_next_scheduled.
	 * @param int       $wp_unschedule_event_times The number of times wp_unschedule_event should be called.
	 *
	 * @return void
	 */
	public function test_unschedule_default_seo_data_detection(
		$wp_next_scheduled_result,
		$wp_unschedule_event_times
	) {
		Functions\expect( 'wp_next_scheduled' )
			->once()
			->with( 'wpseo_detect_default_seo_data' )
			->andReturn( $wp_next_scheduled_result );

		Functions\expect( 'wp_unschedule_event' )
			->times( $wp_unschedule_event_times )
			->with( $wp_next_scheduled_result, 'wpseo_detect_default_seo_data' );

		$this->instance->unschedule_default_seo_data_detection();
	}

	/**
	 * Data provider for the test_unschedule_default_seo_data_detection test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function unschedule_default_seo_data_detection_provider() {
		yield 'No cron scheduled - do not unschedule' => [
			'wp_next_scheduled_result'  => false,
			'wp_unschedule_event_times' => 0,
		];

		yield 'Cron scheduled - unschedule it' => [
			'wp_next_scheduled_result'  => 1234567890,
			'wp_unschedule_event_times' => 1,
		];
	}
}
