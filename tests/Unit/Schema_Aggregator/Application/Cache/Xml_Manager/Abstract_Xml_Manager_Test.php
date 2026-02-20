<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache\Xml_Manager;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Xml_Manager tests.
 */
abstract class Abstract_Xml_Manager_Test extends TestCase {

	/**
	 * The Config mock.
	 *
	 * @var Mockery\MockInterface|Config
	 */
	protected $config;

	/**
	 * The instance under test.
	 *
	 * @var Xml_Manager
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config   = Mockery::mock( Config::class );
		$this->instance = new Xml_Manager( $this->config );
	}
}
