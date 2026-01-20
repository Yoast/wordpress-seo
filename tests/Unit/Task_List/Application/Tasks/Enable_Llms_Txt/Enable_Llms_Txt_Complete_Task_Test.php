<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Enable_Llms_Txt;

use Yoast\WP\SEO\Task_List\Domain\Exceptions\Complete_LLMS_Task_Exception;

/**
 * Test class for completing the task.
 *
 * @group Enable_Llms_Txt
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::complete_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Enable_Llms_Txt_Complete_Task_Test extends Abstract_Enable_Llms_Txt_Test {

	/**
	 * Tests the complete_task method when completed successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_success() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'enable_llms_txt', true )
			->andReturn( true );

		$this->instance->complete_task();
	}

	/**
	 * Tests the complete_task method when completed not successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_failure() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'enable_llms_txt', true )
			->andReturn( false );

		$this->expectException( Complete_LLMS_Task_Exception::class );

		$this->instance->complete_task();
	}
}
