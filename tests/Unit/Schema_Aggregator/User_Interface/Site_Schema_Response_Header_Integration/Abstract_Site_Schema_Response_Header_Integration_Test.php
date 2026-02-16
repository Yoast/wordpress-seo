<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Header_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Response_Header_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Site_Schema_Response_Header_Integration tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Schema_Response_Header_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Response_Header_Integration
	 */
	protected $instance;

	/**
	 * The schema map header adapter mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Header_Adapter
	 */
	protected $schema_map_header_adapter;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_map_header_adapter = Mockery::mock( Schema_Map_Header_Adapter::class );

		$this->instance = new Site_Schema_Response_Header_Integration(
			$this->schema_map_header_adapter,
		);
	}
}
