<?php

namespace Yoast\WP\SEO\Tests\Unit\Surfaces\Values;

use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Exceptions\Forbidden_Property_Mutation_Exception;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Meta_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Surfaces\Values\Meta
 *
 * @group surfaces
 */
final class Meta_Test extends TestCase {

	/**
	 * The context
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * The container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The instance.
	 *
	 * @var Meta
	 */
	protected $instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->context = Mockery::mock( Meta_Tags_Context_Mock::class );

		$helpers         = Mockery::mock( Helpers_Surface::class );
		$replace_vars    = Mockery::mock( WPSEO_Replace_Vars::class );
		$front_end       = Mockery::mock( Front_End_Integration::class );
		$this->container = $this->create_container_with(
			[
				Helpers_Surface::class       => $helpers,
				WPSEO_Replace_Vars::class    => $replace_vars,
				Front_End_Integration::class => $front_end,
			]
		);

		$this->instance = new Meta(
			$this->context,
			$this->container
		);
	}

	/**
	 * Verify that null is returned by the magic __get() method when an attempt is made
	 * to access a (declared) protected or private property from outside the class.
	 *
	 * @covers       ::__get
	 * @dataProvider data_declared_inaccessible_properties
	 *
	 * @param string $name Property name.
	 *
	 * @return void
	 */
	public function test_get_on_inaccessible_property_returns_null( $name ) {
		$this->assertNull( $this->instance->$name );
	}

	/**
	 * The magic set method should prevent setting dynamic properties, as well as prevent
	 * overloading the value of protected/private properties from a context in which they
	 * are inaccessible.
	 *
	 * @covers ::__set
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
	 * @covers ::__unset
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
			'container'      => [ 'container' ],
			'context'        => [ 'context' ],
			'front_end'      => [ 'front_end' ],
			'helpers'        => [ 'helpers' ],
			'replace_vars'   => [ 'replace_vars' ],
			'properties_bin' => [ 'properties_bin' ],
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
