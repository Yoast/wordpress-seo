<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Schema_Map_Builder tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Map_Builder_Test extends TestCase {

	/**
	 * The config mock.
	 *
	 * @var Mockery\MockInterface|Config
	 */
	protected $config;

	/**
	 * The schema map repository mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Repository_Interface
	 */
	protected $schema_map_repository;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Map_Builder
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config                = Mockery::mock( Config::class );
		$this->schema_map_repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$this->instance = new Schema_Map_Builder( $this->config );
		$this->instance->with_repository( $this->schema_map_repository );
	}
}
