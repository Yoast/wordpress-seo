<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Llms_Txt_Cron_Callback_Integration;

use Brain\Monkey;

/**
 * Tests the maybe_remove_llms_file.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Llms_Txt_Cron_Callback_Integration::populate_file
 */
final class Populate_File_Test extends Abstract_Llms_Txt_Cron_Callback_Integration_Test {

	/**
	 * Tests the toggle llms.txt functionality when not doing cron.
	 *
	 * @return void
	 */
	public function test_check_toggle_llms_txt_not_doing_cron() {
		Monkey\Functions\when( 'wp_doing_cron' )->justReturn( false );

		$this->populate_file_command_handler->expects( 'handle' )->never();

		$this->instance->populate_file();
	}

	/**
	 * Tests the toggle llms.txt functionality with feature disabled.
	 *
	 * @return void
	 */
	public function test_check_toggle_llms_txt_feature_disabled() {
		Monkey\Functions\when( 'wp_doing_cron' )->justReturn( true );
		$this->options_helper->expects( 'get' )->with( 'enable_llms_txt', false )->andReturn( false );
		$this->cron_scheduler->expects( 'unschedule_llms_txt_population' );
		$this->command_handler->expects( 'handle' );

		$this->populate_file_command_handler->expects( 'handle' )->never();

		$this->instance->populate_file();
	}

	/**
	 * Tests the toggle llms.txt functionality happy path.
	 *
	 * @return void
	 */
	public function test_check_toggle_llms_txt_populate_file() {
		Monkey\Functions\when( 'wp_doing_cron' )->justReturn( true );
		$this->options_helper->expects( 'get' )->with( 'enable_llms_txt', false )->andReturn( true );
		$this->populate_file_command_handler->expects( 'handle' )->once();
		$this->instance->populate_file();
	}
}
