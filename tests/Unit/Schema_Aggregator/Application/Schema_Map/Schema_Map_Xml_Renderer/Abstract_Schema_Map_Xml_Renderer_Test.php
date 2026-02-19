<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Schema_Map_Xml_Renderer tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Map_Xml_Renderer_Test extends TestCase {

	/**
	 * The schema map config mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Config
	 */
	protected $config;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Map_Xml_Renderer
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config = Mockery::mock( Schema_Map_Config::class );

		$this->instance = new Schema_Map_Xml_Renderer( $this->config );
	}
}
