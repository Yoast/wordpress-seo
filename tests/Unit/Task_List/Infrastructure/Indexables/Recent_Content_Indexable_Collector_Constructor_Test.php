<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Indexables;

/**
 * Tests the constructor of the Recent Content Indexable Collector.
 *
 * @group task-list
 *
 * @covers \Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Recent_Content_Indexable_Collector_Constructor_Test extends Abstract_Recent_Content_Indexable_Collector_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			'Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector',
			$this->instance
		);
	}
}
