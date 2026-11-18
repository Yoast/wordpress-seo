<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Schema_Map_Xml_Provider tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Map_Xml_Provider_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Map_Xml_Provider
	 */
	protected $instance;

	/**
	 * Holds the command handler mock.
	 *
	 * @var Mockery\MockInterface|Aggregate_Site_Schema_Map_Command_Handler
	 */
	protected $command_handler;

	/**
	 * Holds the XML cache manager mock.
	 *
	 * @var Mockery\MockInterface|Xml_Manager
	 */
	protected $xml_cache_manager;

	/**
	 * Holds the aggregator config mock.
	 *
	 * @var Mockery\MockInterface|Aggregator_Config
	 */
	protected $aggregator_config;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->command_handler   = Mockery::mock( Aggregate_Site_Schema_Map_Command_Handler::class );
		$this->xml_cache_manager = Mockery::mock( Xml_Manager::class );
		$this->aggregator_config = Mockery::mock( Aggregator_Config::class );

		$this->instance = new Schema_Map_Xml_Provider(
			$this->command_handler,
			$this->xml_cache_manager,
			$this->aggregator_config,
		);
	}
}
