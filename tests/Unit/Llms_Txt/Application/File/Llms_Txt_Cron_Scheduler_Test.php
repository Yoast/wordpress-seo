<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Llms Txt Scheduler.
 *
 * @group llms.txt
 *
 * @coversDefaultClass \Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler
 *
 * @phpcs :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Llms_Txt_Cron_Scheduler_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Llms_Txt_Cron_Scheduler
	 */
	private $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Llms_Txt_Cron_Scheduler( $this->options_helper );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the schedule_weekly_llms_txt_population method when llms txt is enabled.
	 *
	 * @covers ::schedule_weekly_llms_txt_population
	 * @dataProvider schedule_weekly_llms_txt_population_data
	 *
	 * @param bool $enabled           If the feature is enabled.
	 * @param bool $already_scheduled If the cron is already scheduled.
	 * @param bool $times_scheduled   How many times the cron is scheduled.
	 *
	 * @return void
	 */
	public function test_schedule_weekly_llms_txt_population( $enabled, $already_scheduled, $times_scheduled ) {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( $enabled );

		if ( $enabled ) {
			Monkey\Functions\expect( 'wp_next_scheduled' )
				->once()
				->andReturn( $already_scheduled );

			Monkey\Functions\expect( 'wp_schedule_event' )
				->with( ( \time() + \WEEK_IN_SECONDS ), 'weekly', Llms_Txt_Cron_Scheduler::LLMS_TXT_POPULATION )
				->times( $times_scheduled );
		}
		$this->instance->schedule_weekly_llms_txt_population();
	}

	/**
	 * Data provider for the `test_schedule_weekly_llms_txt_population()` test.
	 *
	 * @return array<array<string, bool|int>>
	 */
	public static function schedule_weekly_llms_txt_population_data() {
		return [
			'feature enabled and not scheduled' => [
				'enabled'           => true,
				'already_scheduled' => false,
				'times_scheduled'   => 1,
			],
			'feature disabled'                  => [
				'enabled'           => false,
				'already_scheduled' => false,
				'times_scheduled'   => 0,
			],
			'feature enabled and scheduled'     => [
				'enabled'           => true,
				'already_scheduled' => true,
				'times_scheduled'   => 0,
			],
		];
	}

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
