<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;

use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Site_Schema_Aggregator_Route tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Schema_Aggregator_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Schema_Aggregator_Route
	 */
	protected $instance;

	/**
	 * Holds the Config mock.
	 *
	 * @var Mockery\MockInterface|Config
	 */
	protected $config;

	/**
	 * Holds the Capability_Helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Holds the command handler mock.
	 *
	 * @var Mockery\MockInterface|Aggregate_Site_Schema_Command_Handler
	 */
	protected $command_handler;

	/**
	 * Holds the cache manager mock.
	 *
	 * @var Mockery\MockInterface|Manager
	 */
	protected $cache_manager;

	/**
	 * Holds the Post_Type_Helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config            = Mockery::mock( Config::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->command_handler   = Mockery::mock( Aggregate_Site_Schema_Command_Handler::class );
		$this->cache_manager     = Mockery::mock( Manager::class );
		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Site_Schema_Aggregator_Route(
			$this->config,
			$this->capability_helper,
			$this->command_handler,
			$this->cache_manager,
			$this->post_type_helper,
		);
	}
}
