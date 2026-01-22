<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Title_Builder;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Title_Adapter;

/**
 * Tests the Title_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder::__construct
 */
final class Constructor_Test extends Abstract_Title_Builder_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Title_Adapter::class,
			$this->getPropertyValue( $this->instance, 'title_adapter' )
		);
	}
}
