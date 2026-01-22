<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration;

use Brain\Monkey;

/**
 * Tests the maybe_remove_llms_file.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Schedule_Population_On_Activation_Integration::schedule_llms_txt_population
 */
final class Schedule_Llms_Txt_Population_Test extends Abstract_Schedule_Population_On_Activation_Integration_Test {

	/**
	 * Tests the toggle schedule_llms_txt_population functionality with the feature enabled.
	 *
	 * @return void
	 */
	public function test_schedule_llms_txt_population_feature_enabled() {
		Monkey\Functions\when( 'wp_doing_cron' )->justReturn( false );
		$this->options_helper->expects( 'get' )->with( 'enable_llms_txt', false )->andReturn( true );
		$this->cron_scheduler->expects( 'schedule_quick_llms_txt_population' );
		$this->instance->schedule_llms_txt_population();
	}

	/**
	 * Tests the toggle schedule_llms_txt_population functionality with the feature disabled.
	 *
	 * @return void
	 */
	public function test_schedule_llms_txt_population_feature_disabled() {
		Monkey\Functions\when( 'wp_doing_cron' )->justReturn( false );
		$this->options_helper->expects( 'get' )->with( 'enable_llms_txt', false )->andReturn( false );
		$this->cron_scheduler->expects( 'schedule_quick_llms_txt_population' )->never();
		$this->instance->schedule_llms_txt_population();
	}
}
