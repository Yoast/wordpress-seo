<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_Readability;

use Yoast\WP\SEO\Task_List\Application\Recent_Content\Recent_Content_Collector_Interface;

/**
 * Test class for the Improve Content Readability constructor.
 *
 * @group Improve_Content_Readability
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_Readability::__construct
 */
final class Constructor_Test extends Abstract_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Recent_Content_Collector_Interface::class,
			$this->getPropertyValue( $this->instance, 'recent_content_indexable_collector' ),
		);
	}
}
