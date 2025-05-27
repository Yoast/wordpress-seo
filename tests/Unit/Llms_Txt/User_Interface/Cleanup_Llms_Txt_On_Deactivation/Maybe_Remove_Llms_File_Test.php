<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation;

/**
 * Tests the maybe_remove_llms_file.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Cleanup_Llms_Txt_On_Deactivation::maybe_remove_llms_file
 */
final class Maybe_Remove_Llms_File_Test extends Abstract_Cleanup_Llms_Txt_On_Deactivation_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers Cleanup_Llms_Txt_On_Deactivation::maybe_remove_llms_file
	 *
	 * @return void
	 */
	public function test_maybe_remove_llms_file() {
		$this->command_handler->expects( 'handle' )->once();
		$this->cron_scheduler->expects( 'unschedule_llms_txt_population' )->once();
		$this->instance->maybe_remove_llms_file();
	}
}
