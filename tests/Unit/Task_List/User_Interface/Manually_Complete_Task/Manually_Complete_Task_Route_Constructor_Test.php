<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Manually_Complete_Task;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Task_List\Infrastructure\Manual_Task_Completion_Repository;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for the constructor.
 *
 * @group Manually_Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Manually_Complete_Task_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Route_Constructor_Test extends Abstract_Manually_Complete_Task_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Tasks_Collector::class,
			$this->getPropertyValue( $this->instance, 'tasks_collector' )
		);
		$this->assertInstanceOf(
			Manual_Task_Completion_Repository::class,
			$this->getPropertyValue( $this->instance, 'manual_task_completion_repository' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
	}
}
