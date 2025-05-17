<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Routes\Alert_Dismissal_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Alert_Dismissal_Route_Test.
 *
 * @group routes
 * @group dismissable-alerts
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Alert_Dismissal_Route
 */
final class Alert_Dismissal_Route_Test extends TestCase {

	/**
	 * Represents the alert dismissal action.
	 *
	 * @var Alert_Dismissal_Action
	 */
	protected $alert_dismissal_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Alert_Dismissal_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->alert_dismissal_action = Mockery::mock( Alert_Dismissal_Action::class );

		$this->instance = new Alert_Dismissal_Route( $this->alert_dismissal_action );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Alert_Dismissal_Action::class,
			$this->getPropertyValue( $this->instance, 'alert_dismissal_action' )
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Alert_Dismissal_Route::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'alerts/dismiss',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'dismiss' ],
					'permission_callback' => [ $this->instance, 'can_dismiss' ],
					'args'                => [
						'key' => [
							'validate_callback' => [ $this->alert_dismissal_action, 'is_allowed' ],
							'required'          => true,
						],
					],
				]
			)
			->once();

		$this->instance->register_routes();
	}

	/**
	 * Tests the dismiss route.
	 *
	 * @covers ::dismiss
	 *
	 * @return void
	 */
	public function test_dismiss() {
		$request = Mockery::mock( WP_REST_Request::class, 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'key' )
			->andReturn( 'alert_key' );

		$this->alert_dismissal_action
			->expects( 'dismiss' )
			->with( 'alert_key' )
			->andReturn( true );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->dismiss( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that can dismiss calls `current_user_can` with `edit_posts`.
	 *
	 * And passes along the returned value.
	 *
	 * @covers ::can_dismiss
	 *
	 * @return void
	 */
	public function test_can_dismiss() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->can_dismiss() );
	}
}
