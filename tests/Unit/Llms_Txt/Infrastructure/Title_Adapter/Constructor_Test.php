<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Title_Adapter;

use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Runner;

/**
 * Tests the Title_Adapter constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Title_Adapter::__construct
 */
final class Constructor_Test extends Abstract_Title_Adapter_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Default_Tagline_Runner::class,
			$this->getPropertyValue( $this->instance, 'default_tagline_runner' )
		);
	}
}
