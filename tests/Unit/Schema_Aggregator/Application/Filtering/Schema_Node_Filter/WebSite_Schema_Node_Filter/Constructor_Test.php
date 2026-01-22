<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\WordPress_Current_Site_URL_Provider;

/**
 * Tests the WebSite_Schema_Node_Filter class.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\WebSite_Schema_Node_Filter::__construct
 *
 * @group schema-aggregator
 */
final class Constructor_Test extends Abstract_WebSite_Schema_Node_Filter_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {

		$this->assertInstanceOf(
			WordPress_Current_Site_URL_Provider::class,
			$this->getPropertyValue( $this->instance, 'current_site_url_provider' )
		);
	}
}
