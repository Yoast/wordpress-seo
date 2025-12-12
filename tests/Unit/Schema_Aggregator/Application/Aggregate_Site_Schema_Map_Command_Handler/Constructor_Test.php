<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Factory;

/**
 * Tests the Aggregate_Site_Schema_Map_Command_Handler constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler::__construct
 */
final class Constructor_Test extends Abstract_Aggregate_Site_Schema_Map_Command_Handler_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Schema_Map_Repository_Factory::class,
			$this->getPropertyValue( $this->instance, 'schema_map_repository_factory' )
		);
		$this->assertInstanceOf(
			Schema_Map_Builder::class,
			$this->getPropertyValue( $this->instance, 'schema_map_builder' )
		);
		$this->assertInstanceOf(
			Schema_Map_Xml_Renderer::class,
			$this->getPropertyValue( $this->instance, 'schema_map_xml_renderer' )
		);
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
	}
}
