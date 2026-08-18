<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_XML_Route;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Site_Schema_Aggregator_Xml_Route tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Schema_Aggregator_Xml_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Aggregator_Xml_Route
	 */
	protected $instance;

	/**
	 * Holds the schema map XML provider mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Xml_Provider
	 */
	protected $schema_map_xml_provider;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_map_xml_provider = Mockery::mock( Schema_Map_Xml_Provider::class );

		$this->instance = new Site_Schema_Aggregator_Xml_Route( $this->schema_map_xml_provider );
	}
}
