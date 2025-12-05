<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache\Xml_Manager;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Tests the Xml_Manager constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::__construct
 */
final class Constructor_Test extends Abstract_Xml_Manager_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Config::class,
			$this->getPropertyValue( $this->instance, 'config' )
		);
	}
}
