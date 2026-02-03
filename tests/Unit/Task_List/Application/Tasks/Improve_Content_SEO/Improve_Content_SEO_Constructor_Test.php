<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO;

use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;

/**
 * Test class for the Improve Content SEO constructor.
 *
 * @group Improve_Content_SEO
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Constructor_Test extends Abstract_Improve_Content_SEO_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Recent_Content_Indexable_Collector::class,
			$this->getPropertyValue( $this->instance, 'recent_content_indexable_collector' )
		);
	}
}
