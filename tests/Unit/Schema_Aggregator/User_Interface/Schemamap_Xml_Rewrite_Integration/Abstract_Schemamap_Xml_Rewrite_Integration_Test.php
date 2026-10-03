<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Mockery;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Schemamap_Xml_Rewrite_Integration tests.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schemamap_Xml_Rewrite_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schemamap_Xml_Rewrite_Integration
	 */
	protected $instance;

	/**
	 * Holds the schema map XML provider mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Xml_Provider
	 */
	protected $schema_map_xml_provider;

	/**
	 * Holds the redirect helper mock.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	protected $redirect_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_map_xml_provider = Mockery::mock( Schema_Map_Xml_Provider::class );
		$this->redirect_helper         = Mockery::mock( Redirect_Helper::class );

		$this->instance = new Schemamap_Xml_Rewrite_Integration(
			$this->schema_map_xml_provider,
			$this->redirect_helper,
		);
	}
}
