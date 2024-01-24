<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use Exception;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Exceptions\Forbidden_Property_Mutation_Exception;
use Yoast\WP\SEO\Integrations\Third_Party\Elementor;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher;
use Yoast\WP\SEO\Tests\Unit\Doubles\Main_Double;

/**
 * Class Loader_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Main
 */
final class Main_Test extends TestCase {

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
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Main_Double();
		$this->instance->load();

		global $wpdb;
		$wpdb = Mockery::mock( wpdb::class );
	}

	/**
	 * Tests the DI container.
	 *
	 * @covers ::get_container
	 *
	 * @return void
	 */
	public function test_surfaces() {
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

	/**
	 * Verify that null is returned by the magic __get() method when an attempt is made
	 * to access a (declared) protected or private property from outside the class.
	 *
	 * {@internal This test is on the Main class as the Abstract_main class is... abstract.}
	 *
	 * @covers       Yoast\WP\Lib\Abstract_Main::__get
	 * @dataProvider data_declared_inaccessible_properties
	 *
	 * @param string $name Property name.
	 *
	 * @return void
	 */
	public function test_get_on_inaccessible_property_is_forbidden( $name ) {
		$this->expectException( Exception::class );
		$this->expectExceptionMessage( "Property \$$name does not exist." );

		$this->instance->$name;
	}

	/**
	 * The magic set method should prevent setting dynamic properties, as well as prevent
	 * overloading the value of protected/private properties from a context in which they
	 * are inaccessible.
	 *
	 * {@internal This test is on the Main class as the Abstract_main class is... abstract.}
	 *
	 * @covers Yoast\WP\Lib\Abstract_Main::__set
	 *
	 * @dataProvider data_declared_inaccessible_properties
	 * @dataProvider data_undeclared_properties
	 *
	 * @param string $name Property name.
	 *
	 * @return void
	 */
	public function test_set_is_forbidden( $name ) {
		$this->expectException( Forbidden_Property_Mutation_Exception::class );
		$this->expectExceptionMessage( "Setting property \$$name is not supported." );

		$this->instance->$name = 'dynamic property';
	}

	/**
	 * The magic unset method should prevent unsetting dynamic properties, as well as prevent
	 * unsetting protected/private properties from a context in which they are inaccessible.
	 *
	 * {@internal This test is on the Main class as the Abstract_main class is... abstract.}
	 *
	 * @covers Yoast\WP\Lib\Abstract_Main::__unset
	 *
	 * @dataProvider data_declared_inaccessible_properties
	 * @dataProvider data_undeclared_properties
	 *
	 * @param string $name Property name.
	 *
	 * @return void
	 */
	public function test_unset_is_forbidden( $name ) {
		$this->expectException( Forbidden_Property_Mutation_Exception::class );
		$this->expectExceptionMessage( "Unsetting property \$$name is not supported." );

		unset( $this->instance->$name );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public static function data_declared_inaccessible_properties() {
		return [
			'container'       => [ 'container' ],
			'cached_surfaces' => [ 'cached_surfaces' ],
		];
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public static function data_undeclared_properties() {
		return [
			'xyz'     => [ 'xyz' ],
			'unknown' => [ 'unknown' ],
		];
	}
}
