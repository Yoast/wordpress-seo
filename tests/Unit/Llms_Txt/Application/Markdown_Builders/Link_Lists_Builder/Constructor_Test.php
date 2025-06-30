<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector;

/**
 * Tests the Link_Lists_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder::__construct
 */
final class Constructor_Test extends Abstract_Link_Lists_Builder_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Content_Types_Collector::class,
			$this->getPropertyValue( $this->instance, 'content_types_collector' )
		);
		$this->assertInstanceOf(
			Terms_Collector::class,
			$this->getPropertyValue( $this->instance, 'terms_collector' )
		);
	}
}
