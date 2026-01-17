<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\Abstract_Cache_Listener_Integration;

use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Abstract_Cache_Listener_Integration;

/**
 * Test class for the Abstract_Cache_Listener_Integration constructor.
 *
 * @group Abstract_Cache_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Abstract_Cache_Listener_Integration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Abstract_Cache_Listener_Integration_Constructor_Test extends Abstract_Abstract_Cache_Listener_Integration_Test {

	/**
	 * The instance under test.
	 *
	 * @var Abstract_Cache_Listener_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new class(
			$this->indexable_repository,
			$this->config,
			$this->manager,
			$this->xml_manager
		) extends Abstract_Cache_Listener_Integration {

			/**
			 * Registers hooks for the integration.
			 *
			 * @return void
			 */
			public function register_hooks() {
				// Empty implementation for testing.
			}

			/**
			 * Gets the conditionals for the integration.
			 *
			 * @return array<string> The conditionals.
			 */
			public static function get_conditionals(): array {
				return [];
			}
		};
	}

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
		$this->assertInstanceOf(
			Config::class,
			$this->getPropertyValue( $this->instance, 'config' )
		);
		$this->assertInstanceOf(
			Manager::class,
			$this->getPropertyValue( $this->instance, 'manager' )
		);
		$this->assertInstanceOf(
			Xml_Manager::class,
			$this->getPropertyValue( $this->instance, 'xml_manager' )
		);
	}
}
