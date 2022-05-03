<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Third_Party\Elementor;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher;
use Yoast\WP\SEO\Tests\Unit\Doubles\Main_Double;

/**
 * Class Loader_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Main
 */
class Main_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Main_Double The Main class double.
	 */
	private $instance;

	/**
	 * Aliasses set in the DI container.
	 *
	 * @var array
	 */
	private $aliasses = [
		'service_container' => 'YoastSEO_Vendor\\YoastSEO_Vendor\\Symfony\\Component\\DependencyInjection\\ContainerInterface',
	];

	/**
	 * Classes that are excluded from the test because they have logic in their constructor.
	 *
	 * @var string[] Array of classes.
	 */
	private $excluded_classes = [
		Indexable_Category_Permalink_Watcher::class,
		Indexable_Permalink_Watcher::class,
		Elementor::class,
	];

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Main_Double();
		$this->instance->load();

		global $wpdb;
		$wpdb = Mockery::mock( '\wpdb' );
	}

	/**
	 * Tests the DI container.
	 *
	 * @covers ::get_container
	 */
	public function test_surfaces() {
		// These two expectations should be removed once the underlying issue has been resolved.
		if ( \PHP_VERSION_ID >= 80100 ) {
			$this->expectDeprecation();
			$this->expectDeprecationMessage( 'Constant FILTER_SANITIZE_STRING is deprecated' );
		}

		// Deprecated classes call _deprecated_function in the constructor, so stub the function to do nothing.
		Monkey\Functions\stubs( [ '_deprecated_function' => '__return_null' ] );

		// Some classes call the YoastSEO function in the constructor.
		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( $this->instance );

		$container = $this->instance->get_container();

		foreach ( $container->getServiceIds() as $service_id ) {
			if ( \in_array( $service_id, $this->excluded_classes, true ) ) {
				continue;
			}
			if ( isset( $this->aliasses[ $service_id ] ) ) {
				$service_id = $this->aliasses[ $service_id ];
			}
			if ( \strpos( $service_id, 'YoastSEO_Vendor' ) === 0 ) {
				continue;
			}

			$this->assertInstanceOf( $service_id, $container->get( $service_id ) );
		}
	}
}
