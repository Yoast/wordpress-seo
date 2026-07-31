<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Content_Types\Content_Types_Repository;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;

/**
 * Tests the Content_Types_Repository constructor.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository::__construct
 */
final class Constructor_Test extends Abstract_Content_Types_Repository_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Content_Types_Collector::class,
			$this->getPropertyValue( $this->instance, 'content_types_collector' ),
		);
	}
}
