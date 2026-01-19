<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Description_Adapter;

use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Tests the Description_Adapter constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Description_Adapter::__construct
 */
final class Constructor_Test extends Abstract_Description_Adapter_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Meta_Surface::class,
			$this->getPropertyValue( $this->instance, 'meta' )
		);
	}
}
