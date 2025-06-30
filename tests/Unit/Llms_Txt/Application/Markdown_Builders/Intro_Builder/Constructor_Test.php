<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Intro_Builder;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector;

/**
 * Tests the Intro_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Intro_Builder::__construct
 */
final class Constructor_Test extends Abstract_Intro_Builder_Test {

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
