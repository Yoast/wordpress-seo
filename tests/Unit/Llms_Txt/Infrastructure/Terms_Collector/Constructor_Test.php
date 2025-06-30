<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Terms_Collector;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Tests the Terms_Collector constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector::__construct
 */
final class Constructor_Test extends Abstract_Terms_Collector_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' )
		);
	}
}
