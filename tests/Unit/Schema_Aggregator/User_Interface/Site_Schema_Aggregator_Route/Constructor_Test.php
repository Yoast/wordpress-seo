<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Tests for the Site_Schema_Aggregator_Route constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route::__construct
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Site_Schema_Aggregator_Route_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Config::class,
			$this->getPropertyValue( $this->instance, 'config' )
		);

		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);

		$this->assertInstanceOf(
			Aggregate_Site_Schema_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'aggregate_site_schema_command_handler' )
		);

		$this->assertInstanceOf(
			Manager::class,
			$this->getPropertyValue( $this->instance, 'cache_manager' )
		);
	}
}
