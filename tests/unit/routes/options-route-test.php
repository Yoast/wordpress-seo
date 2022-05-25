<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Options\Options_Action;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Routes\Options_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Route_Test.
 *
 * @group routes
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Options_Route
 */
class Options_Route_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Options_Route
	 */
	protected $instance;

	/**
	 * Holds the options action instance.
	 *
	 * @var Options_Action|Mockery\MockInterface
	 */
	protected $options_action;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper|Mockery\MockInterface
	 */
	protected $capability_helper;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_action    = Mockery::mock( Options_Action::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->instance          = new Options_Route( $this->options_action, $this->capability_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Options_Route::class, $this->instance );
		$this->assertInstanceOf(
			Options_Action::class,
			$this->getPropertyValue( $this->instance, 'options_action' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )->with(
			'yoast/v1',
			'options',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this->instance, 'get' ],
					'permission_callback' => [ $this->instance, 'can_get' ],
					'args'                => [
						'options' => [
							'required' => false,
						],
					],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'set' ],
					'permission_callback' => [ $this->instance, 'can_set' ],
				],
			]
		);

		$this->instance->register_routes();
	}

	/**
	 * Tests the get.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options_action->expects( 'get' )
			->with( [] )
			->andReturn( [ 'foo' => 'bar' ] );

		$request = Mockery::mock( 'WP_Rest_Request' );
		$request->expects( 'get_param' )
			->with( 'options' )
			->andReturnNull();

		Mockery::mock( 'WP_Rest_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->get( $request ) );
	}

	/**
	 * Tests the set.
	 *
	 * @covers ::set
	 */
	public function test_set() {
		$this->options_action->expects( 'set' )
			->twice()
			->with( [ 'foo' => 'bar' ] )
			->andReturn( [ 'success' => true ], [ 'success' => false ] );

		$request = Mockery::mock( 'WP_Rest_Request' );
		$request->expects( 'get_params' )
			->twice()
			->andReturn( [ 'foo' => 'bar' ] );

		Mockery::mock( 'WP_Rest_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->set( $request ) );
		$this->assertInstanceOf( 'WP_Rest_Response', $this->instance->set( $request ) );
	}

	/**
	 * Tests the get permissions.
	 *
	 * @covers ::can_get
	 */
	public function test_can_get() {
		$this->capability_helper->expects( 'current_user_can' )
			->twice()
			->with( 'read' )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->can_get() );
		$this->assertFalse( $this->instance->can_get() );
	}

	/**
	 * Tests the set permissions.
	 *
	 * @covers ::can_set
	 */
	public function test_can_set() {
		$this->capability_helper->expects( 'current_user_can' )
			->twice()
			->with( 'wpseo_manage_options' )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->can_set() );
		$this->assertFalse( $this->instance->can_set() );
	}
}
