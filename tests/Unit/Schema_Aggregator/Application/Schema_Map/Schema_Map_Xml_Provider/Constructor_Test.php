<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;

use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;

/**
 * Tests the Schema_Map_Xml_Provider constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider::__construct
 */
final class Constructor_Test extends Abstract_Schema_Map_Xml_Provider_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Aggregate_Site_Schema_Map_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'aggregate_site_schema_map_command_handler' ),
		);
		$this->assertInstanceOf(
			Xml_Manager::class,
			$this->getPropertyValue( $this->instance, 'xml_cache_manager' ),
		);
		$this->assertInstanceOf(
			Aggregator_Config::class,
			$this->getPropertyValue( $this->instance, 'aggregator_config' ),
		);
	}
}
