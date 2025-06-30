<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;

use Generator;

/**
 * Tests the maybe_remove_llms_file.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher::check_toggle_llms_txt
 */
final class Check_Toggle_Llms_Txt_Test extends Abstract_Enable_Llms_Txt_Option_Watcher_Test {

	/**
	 * Tests the toggle llms.txt functionality.
	 *
	 * @dataProvider check_toggle_llms_txt_data
	 *
	 * @param array<bool> $old_value     The old value.
	 * @param array<bool> $new_value     The new value.
	 * @param bool        $should_enable Whether the feature should be enabled.
	 *
	 * @return void
	 */
	public function test_check_toggle_llms_txt( $old_value, $new_value, $should_enable ) {
		if ( $should_enable ) {
			$this->cron_scheduler->expects( 'schedule_weekly_llms_txt_population' )->once();
			$this->populate_file_command_handler->expects( 'handle' )->once();
		}
		else {
			$this->cron_scheduler->expects( 'unschedule_llms_txt_population' )->once();
			$this->command_handler->expects( 'handle' )->once();
		}

		$this->instance->check_toggle_llms_txt( $old_value, $new_value );
	}

	/**
	 * Data provider for test_check_toggle_llms_txt.
	 *
	 * @return Generator
	 */
	public function check_toggle_llms_txt_data() {

		yield 'enable llms txt' => [
			'old_value'     => [ 'enable_llms_txt' => false ],
			'new_value'     => [ 'enable_llms_txt' => true ],
			'should_enable' => true,
		];
		yield 'disable llms txt' => [
			'old_value'     => [ 'enable_llms_txt' => true ],
			'new_value'     => [ 'enable_llms_txt' => false ],
			'should_enable' => false,
		];
	}

	/**
	 * Tests that nothing happens when there is no option change.
	 *
	 * @dataProvider check_toggle_llms_txt_no_change_data
	 *
	 * @param array<bool> $old_value The old value.
	 * @param array<bool> $new_value The new value.
	 *
	 * @return void
	 */
	public function test_check_toggle_llms_txt_no_change( $old_value, $new_value ) {

			$this->cron_scheduler->expects( 'schedule_weekly_llms_txt_population' )->never();
			$this->populate_file_command_handler->expects( 'handle' )->never();

			$this->cron_scheduler->expects( 'unschedule_llms_txt_population' )->never();
			$this->command_handler->expects( 'handle' )->never();

		$this->instance->check_toggle_llms_txt( $old_value, $new_value );
	}

	/**
	 * Data provider for test_check_toggle_llms_txt.
	 *
	 * @return Generator
	 */
	public function check_toggle_llms_txt_no_change_data() {

		yield 'already enabled' => [
			'old_value'     => [ 'enable_llms_txt' => true ],
			'new_value'     => [ 'enable_llms_txt' => true ],
		];
		yield 'already disabled' => [
			'old_value'     => [ 'enable_llms_txt' => false ],
			'new_value'     => [ 'enable_llms_txt' => false ],
		];
	}
}
