<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;

/**
 * Test class for the constructor.
 *
 * @group Tasks_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks_Repository::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Repository_Constructor_Test extends Abstract_Tasks_Repository_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Cached_Tasks_Collector::class,
			$this->getPropertyValue( $this->instance, 'tasks_collector' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
