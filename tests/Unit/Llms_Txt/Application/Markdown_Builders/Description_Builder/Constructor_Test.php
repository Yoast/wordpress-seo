<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Description_Builder;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Description_Adapter;

/**
 * Tests the Description_Builder constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder::__construct
 */
final class Constructor_Test extends Abstract_Description_Builder_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Description_Adapter::class,
			$this->getPropertyValue( $this->instance, 'description_adapter' )
		);
	}
}
