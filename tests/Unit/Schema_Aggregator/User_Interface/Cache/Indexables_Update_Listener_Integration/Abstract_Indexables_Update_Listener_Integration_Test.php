<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;

use Mockery;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Indexables_Update_Listener_Integration_Test tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Indexables_Update_Listener_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Indexables_Update_Listener_Integration
	 */
	protected $instance;

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The config mock.
	 *
	 * @var Mockery\MockInterface|Config
	 */
	protected $config;

	/**
	 * The manager mock.
	 *
	 * @var Mockery\MockInterface|Manager
	 */
	protected $manager;

	/**
	 * The XML manager mock.
	 *
	 * @var Mockery\MockInterface|Xml_Manager
	 */
	protected $xml_manager;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->config               = Mockery::mock( Config::class );
		$this->manager              = Mockery::mock( Manager::class );
		$this->xml_manager          = Mockery::mock( Xml_Manager::class );

		$this->instance = new Indexables_Update_Listener_Integration(
			$this->indexable_repository,
			$this->config,
			$this->manager,
			$this->xml_manager
		);
	}
}
