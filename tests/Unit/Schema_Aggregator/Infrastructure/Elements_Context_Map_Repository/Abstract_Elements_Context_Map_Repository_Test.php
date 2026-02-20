<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Elements_Context_Map_Repository;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Map_Loader_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Elements_Context_Map_Repository tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Elements_Context_Map_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Elements_Context_Map_Repository
	 */
	protected $instance;

	/**
	 * Holds the Map_Loader_Interface mock.
	 *
	 * @var Mockery\MockInterface|Map_Loader_Interface
	 */
	protected $map_loader;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->map_loader = Mockery::mock( Map_Loader_Interface::class );

		$this->instance = new Elements_Context_Map_Repository(
			$this->map_loader,
		);
	}
}
