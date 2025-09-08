<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands\Remove_File;

use Brain\Monkey;

/**
 * Tests the handler.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler::handle
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Handle_Test extends Abstract_Remove_File_Command_Handler_Test {

	/**
	 * Tests the handle execution by mocking expected behaviors and verifying interactions.
	 *
	 * @param bool $managed_by_yoast               If Yoast SEO manages the file.
	 * @param bool $file_remove_successfully       If the file content was removed successfully.
	 * @param int  $file_remove_successfully_times The number of times the file remove function is called.
	 * @param int  $times_update_called            The number of times the update_option function is expected to be called.
	 *
	 * @return void
	 * @dataProvider handle_data
	 */
	public function test_handle( bool $managed_by_yoast, bool $file_remove_successfully, int $file_remove_successfully_times, int $times_update_called ) {
		$this->permission_gate->expects( 'is_managed_by_yoast_seo' )->andReturn( $managed_by_yoast );
		$this->file_system_adapter->expects( 'remove_file' )->times( $file_remove_successfully_times )->andReturn( $file_remove_successfully );

		Monkey\Functions\expect( 'update_option' )
			->times( $times_update_called );

		$this->instance->handle();
	}

	/**
	 * Dataprovider for the `test_handle` test.
	 *
	 * @return Generator
	 */
	public function handle_data() {
		yield 'file not managed by yoast' => [ false, false, 0, 0 ];
		yield 'file managed by Yoast but not written' => [ true, false, 1, 0 ];
		yield 'file managed by Yoast and written' => [ true, true, 1, 1 ];
	}
}
