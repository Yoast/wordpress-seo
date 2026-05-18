<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

/**
 * Tests the Banner_Permanent_Dismissal_Route set_banner_permanent_dismissal method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route::set_banner_permanent_dismissal
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Banner_Permanent_Dismissal_Test extends Abstract_Banner_Permanent_Dismissal_Route_Test {

	/**
	 * Tests that set_banner_permanent_dismissal returns a 200 success response when the meta is updated.
	 *
	 * @return void
	 */
	public function test_returns_200_when_meta_is_updated() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'is_dismissed' )->andReturn( true );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( 42 );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response->expects( '__construct' )->once()->with( [ 'success' => true ], 200 );

		$result = $this->instance->set_banner_permanent_dismissal( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests that set_banner_permanent_dismissal returns 200 when the value is already set (idempotent).
	 *
	 * @return void
	 */
	public function test_returns_200_when_value_already_set() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'is_dismissed' )->andReturn( true );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( false );
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '1' );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response->expects( '__construct' )->once()->with( [ 'success' => true ], 200 );

		$result = $this->instance->set_banner_permanent_dismissal( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests that set_banner_permanent_dismissal returns 400 when the update fails.
	 *
	 * @return void
	 */
	public function test_returns_400_when_update_fails() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'is_dismissed' )->andReturn( true );

		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( false );
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( 1, Banner_Permanent_Dismissal_Route::USER_META_KEY, true )
			->andReturn( '' );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response->expects( '__construct' )->once()->with( [ 'success' => false ], 400 );

		$result = $this->instance->set_banner_permanent_dismissal( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
