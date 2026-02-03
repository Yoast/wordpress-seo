<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors\Cached_Collector;

use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for the constructor.
 *
 * @group Cached_Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Cached_Tasks_Collector_Constructor_Test extends Abstract_Cached_Tasks_Collector_Test {

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
	}
}
