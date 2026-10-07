<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Token_Manager;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Class Token_Invalidate_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_invalidate
 */
final class Token_Invalidate_Test extends Abstract_Test {

	/**
	 * Tests the token_invalidate method with a valid access token.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_valid_access_token() {
		$user_id    = 123;
		$access_jwt = 'valid_access_token';

		// Mock getting the access token.
		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( $access_jwt );

		// Mock the HTTP request.
		$this->request_handler
			->expects( 'handle' )
			->with(
				Mockery::on(
					static function ( Request $request ) use ( $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === null
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					},
				),
			)
			->once();

		// Mock token deletion.
		$this->access_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->refresh_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when access token retrieval throws RuntimeException.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_access_token_exception() {
		$user_id = 123;

		// Mock getting the access token throwing an exception.
		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andThrow( new RuntimeException( 'Token not found' ) );

		// Mock the HTTP request with empty access token.
		$this->request_handler
			->expects( 'handle' )
			->with(
				Mockery::on(
					static function ( Request $request ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === null
						&& $request->get_headers() === [ 'Authorization' => 'Bearer ' ];
					},
				),
			)
			->once();

		// Mock token deletion.
		$this->access_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->refresh_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when request handler throws Unauthorized_Exception.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_unauthorized_exception() {
		$user_id    = 123;
		$access_jwt = 'invalid_access_token';

		// Mock getting the access token.
		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( $access_jwt );

		// Mock the HTTP request throwing Unauthorized_Exception.
		$this->request_handler
			->expects( 'handle' )
			->with(
				Mockery::on(
					static function ( Request $request ) use ( $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === null
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					},
				),
			)
			->once()
			->andThrow( new Unauthorized_Exception( 'Unauthorized', 401 ) );

		// Mock token deletion should still happen.
		$this->access_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->refresh_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when request handler throws Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_forbidden_exception() {
		$user_id    = 123;
		$access_jwt = 'forbidden_access_token';

		// Mock getting the access token.
		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( $access_jwt );

		// Mock the HTTP request throwing Forbidden_Exception.
		$this->request_handler
			->expects( 'handle' )
			->with(
				Mockery::on(
					static function ( Request $request ) use ( $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === null
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					},
				),
			)
			->once()
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		// Mock token deletion should still happen.
		$this->access_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->refresh_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests that the local tokens are still cleared when the remote invalidation fails with an
	 * exception that propagates to the caller.
	 *
	 * @return void
	 */
	public function test_token_invalidate_clears_tokens_when_remote_invalidation_fails() {
		$user_id    = 123;
		$access_jwt = 'valid_access_token';

		// Mock getting the access token.
		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( $access_jwt );

		// Mock the HTTP request throwing an exception that is not swallowed.
		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Internal_Server_Error_Exception( 'Internal Server Error', 500 ) );

		// Token deletion should still happen before the exception propagates.
		$this->access_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->refresh_token_repository
			->expects( 'delete_token' )
			->with( $user_id )
			->once();

		$this->expectException( Internal_Server_Error_Exception::class );

		$this->instance->token_invalidate( $user_id );
	}
}
