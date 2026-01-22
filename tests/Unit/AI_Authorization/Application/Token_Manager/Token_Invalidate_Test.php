<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Token_Manager;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;

/**
 * Class Token_Invalidate_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager::token_invalidate
 */
final class Token_Invalidate_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests the token_invalidate method with a valid access token.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_valid_access_token() {
		$user_id    = '123';
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
					static function ( Request $request ) use ( $user_id, $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === [ 'user_id' => $user_id ]
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					}
				)
			)
			->once();

		// Mock user meta deletion.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when access token retrieval throws RuntimeException.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_access_token_exception() {
		$user_id = '123';

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
					static function ( Request $request ) use ( $user_id ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === [ 'user_id' => $user_id ]
						&& $request->get_headers() === [ 'Authorization' => 'Bearer ' ];
					}
				)
			)
			->once();

		// Mock user meta deletion.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when request handler throws Unauthorized_Exception.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_unauthorized_exception() {
		$user_id    = '123';
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
					static function ( Request $request ) use ( $user_id, $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === [ 'user_id' => $user_id ]
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					}
				)
			)
			->once()
			->andThrow( new Unauthorized_Exception( 'Unauthorized', 401 ) );

		// Mock user meta deletion should still happen.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Tests the token_invalidate method when request handler throws Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_token_invalidate_with_forbidden_exception() {
		$user_id    = '123';
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
					static function ( Request $request ) use ( $user_id, $access_jwt ) {
						return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body() === [ 'user_id' => $user_id ]
						&& $request->get_headers() === [ 'Authorization' => "Bearer $access_jwt" ];
					}
				)
			)
			->once()
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		// Mock user meta deletion should still happen.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		$this->instance->token_invalidate( $user_id );
	}
}
