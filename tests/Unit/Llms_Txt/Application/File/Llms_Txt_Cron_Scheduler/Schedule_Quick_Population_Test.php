<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

use Brain\Monkey;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

/**
 * Tests the Llms Txt Scheduler's schedule_quick_llms_txt_population.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler::schedule_quick_llms_txt_population
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler::unschedule_llms_txt_population
 */
final class Schedule_Quick_Population_Test extends Abstract_Llms_Txt_Cron_Scheduler_Test {

	/**
	 * Tests the schedule_quick_llms_txt_population method when llms txt is enabled.
	 *
	 * @covers ::schedule_quick_llms_txt_population
	 * @covers ::unschedule_llms_txt_population
	 * @dataProvider schedule_quick_llms_txt_population_data
	 *
	 * @param bool $enabled           If the feature is enabled.
	 * @param bool $already_scheduled If the cron is already scheduled.
	 *
	 * @return void
	 */
	public function test_schedule_quick_llms_txt_population( $enabled, $already_scheduled ) {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( $enabled );

		if ( $enabled ) {
			Monkey\Functions\expect( 'wp_next_scheduled' )
				->andReturn( $already_scheduled );

			if ( $already_scheduled ) {
				Monkey\Functions\expect( 'wp_unschedule_event' )
					->once();
			}
			Monkey\Functions\expect( 'wp_schedule_event' )
				->with( ( \time() + ( \MINUTE_IN_SECONDS * 5 ) ), 'weekly', Llms_Txt_Cron_Scheduler::LLMS_TXT_POPULATION );
		}

		$this->instance->schedule_quick_llms_txt_population();
	}

	/**
	 * Data provider for the `test_schedule_weekly_llms_txt_population()` test.
	 *
	 * @return array<array<string, bool|int>>
	 */
	public static function schedule_quick_llms_txt_population_data() {
		return [
			'feature enabled and not scheduled' => [
				'enabled'           => true,
				'already_scheduled' => false,
			],
			'feature disabled'                  => [
				'enabled'           => false,
				'already_scheduled' => false,
			],
			'feature enabled and scheduled'     => [
				'enabled'           => true,
				'already_scheduled' => true,
			],
		];
	}
}
