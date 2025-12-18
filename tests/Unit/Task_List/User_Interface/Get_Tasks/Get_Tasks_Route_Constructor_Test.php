<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Get_Tasks;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks_Repository;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;

/**
 * Test class for the constructor.
 *
 * @group Get_Tasks_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Get_Tasks_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Tasks_Route_Constructor_Test extends Abstract_Get_Tasks_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Tasks_Repository::class,
			$this->getPropertyValue( $this->instance, 'tasks_repository' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
		$this->assertInstanceOf(
			Action_Tracker::class,
			$this->getPropertyValue( $this->instance, 'action_tracker' )
		);
	}
}
