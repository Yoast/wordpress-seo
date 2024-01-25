<?php

namespace Yoast\WP\SEO\Tests\Unit\Surfaces;

use stdClass;
use Yoast\WP\SEO\Exceptions\Forbidden_Property_Mutation_Exception;
use Yoast\WP\SEO\Surfaces\Twitter_Helpers_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;

/**
 * Class Twitter_Helpers_Surface_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Surfaces\Twitter_Helpers_Surface
 *
 * @group surfaces
 */
final class Twitter_Helpers_Surface_Test extends TestCase {

	/**
	 * The container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The instance.
	 *
	 * @var Twitter_Helpers_Surface
	 */
	protected $instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->container = $this->create_container_with( [] );
		$this->instance  = new Twitter_Helpers_Surface( $this->container );
	}

	/**
	 * Tests the magic get function.
	 *
	 * @covers ::__get
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 * @param string $classname   Expected class name.
	 *
	 * @return void
	 */
	public function test_magic_get( $helper_name, $classname ) {
		$test_service = new stdClass();
		$this->container->set( $classname, $test_service );

		$actual = $this->instance->$helper_name;

		$this->assertSame( $test_service, $actual );
	}

	/**
	 * The get method should rethrow exceptions from the container.
	 *
	 * @covers ::__get
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 *
	 * @return void
	 */
	public function test_get_invalid_service( $helper_name ) {
		$this->expectException( ServiceNotFoundException::class );

		$this->instance->$helper_name;
	}

	/**
	 * Tests the magic isset function.
	 *
	 * @covers ::__isset
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 * @param string $classname   Expected class name.
	 *
	 * @return void
	 */
	public function test_isset_exists( $helper_name, $classname ) {
		$this->container->set( $classname, new stdClass() );

		$actual = isset( $this->instance->$helper_name );

		$this->assertTrue( $actual );
	}

	/**
	 * Tests the magic isset function.
	 *
	 * @covers ::__isset
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 *
	 * @return void
	 */
	public function test_isset_does_not_exist( $helper_name ) {

		$actual = isset( $this->instance->$helper_name );

		$this->assertFalse( $actual );
	}

	/**
	 * The magic set method should prevent setting dynamic properties.
	 *
	 * @covers ::__set
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 *
	 * @return void
	 */
	public function test_set_is_forbidden( $helper_name ) {
		$this->expectException( Forbidden_Property_Mutation_Exception::class );
		$this->expectExceptionMessage( "Setting property \$$helper_name is not supported." );

		$this->instance->$helper_name = 'dynamic property';
	}

	/**
	 * The magic unset method should prevent unsetting dynamic properties.
	 *
	 * @covers ::__unset
	 * @dataProvider provide_classes
	 *
	 * @param string $helper_name Helper name.
	 *
	 * @return void
	 */
	public function test_unset_is_forbidden( $helper_name ) {
		$this->expectException( Forbidden_Property_Mutation_Exception::class );
		$this->expectExceptionMessage( "Unsetting property \$$helper_name is not supported." );

		unset( $this->instance->$helper_name );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public static function provide_classes() {
		return [
			'get helpers from the helpers namespace'        => [
				'helper_name' => 'test',
				'classname'   => 'Yoast\WP\SEO\Helpers\Twitter\Test_Helper',
			],
			'camelcase classnames'                          => [
				'helper_name' => 'my_own_Thing',
				'classname'   => 'Yoast\WP\SEO\Helpers\Twitter\My_Own_Thing_Helper',
			],
			'does not expose privately declared properties' => [
				'helper_name' => 'container',
				'classname'   => 'Yoast\WP\SEO\Helpers\Twitter\Container_Helper',
			],
		];
	}
}
