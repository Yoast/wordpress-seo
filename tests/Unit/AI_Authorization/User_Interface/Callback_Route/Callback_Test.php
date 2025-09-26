<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\User_Interface\Callback_Route;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the Abstract_Callback_Route's callback method.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\User_Interface\Abstract_Callback_Route::callback
 */
final class Callback_Test extends Abstract_Callback_Route_Test {

	/**
	 * Tests the callback method.
	 *
	 * @return void
	 */
	public function test_callback() {
		$user_id = 1;

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'user_id' )
			->andReturn( $user_id );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );

		$code_verifier = Mockery::mock( Code_Verifier::class );

		$this->code_verifier_repository
			->expects( 'get_code_verifier' )
			->once()
			->with( $user_id )
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->times( 2 )
			->andReturn( 'test' );

		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'code_challenge' )
			->andReturn( \hash( 'sha256', 'test' ) );

		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'access_jwt' )
			->andReturn( 'test' );

		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'refresh_jwt' )
			->andReturn( 'test' );

		$this->access_token_repository
			->expects( 'store_token' )
			->once()
			->with( $user_id, 'test' );

		$this->refresh_token_repository
			->expects( 'store_token' )
			->once()
			->with( $user_id, 'test' );

		$this->code_verifier_repository
			->expects( 'delete_code_verifier' )
			->once()
			->with( $user_id );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'message'       => 'Tokens successfully stored.',
					'code_verifier' => 'test',
				]
			);

		$result = $this->instance->callback( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests an unauthorized exception.
	 *
	 * @return void
	 */
	public function test_callback_with_unauthorized_exception() {
		$user_id = 1;

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'user_id' )
			->andReturn( $user_id );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );

		$code_verifier = Mockery::mock( Code_Verifier::class );

		$this->code_verifier_repository
			->expects( 'get_code_verifier' )
			->once()
			->with( $user_id )
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->once()
			->andReturn( 'test' );

		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'code_challenge' )
			->andReturn( '' );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( 'Unauthorized.', 401 );

		$result = $this->instance->callback( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
