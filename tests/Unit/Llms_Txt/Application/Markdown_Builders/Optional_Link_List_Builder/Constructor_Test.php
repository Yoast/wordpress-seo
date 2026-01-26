<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector;

/**
 * Tests the Optional_Link_List_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder::__construct
 */
final class Constructor_Test extends Abstract_Optional_Link_List_Builder_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Sitemap_Link_Collector::class,
			$this->getPropertyValue( $this->instance, 'sitemap_link_collector' )
		);
	}
}
