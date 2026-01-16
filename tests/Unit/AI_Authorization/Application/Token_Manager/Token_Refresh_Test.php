<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Token_Manager;

use Brain\Monkey;
use Mockery;
use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;

/**
 * Class Token_Refresh_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager::token_refresh
 */
final class Token_Refresh_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests token_refresh when refresh token exists and request succeeds.
	 *
	 * @return void
	 */
	public function test_token_refresh_success() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->with(
				Mockery::on(
					static function ( Request $request ) use ( $code, $refresh_jwt ) {
						return $request->get_action_path() === '/token/refresh'
						&& $request->get_body() === [ 'code_challenge' => \hash( 'sha256', $code ) ]
						&& $request->get_headers() === [ 'Authorization' => "Bearer $refresh_jwt" ];
					}
				)
			)
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when refresh token repository throws RuntimeException.
	 *
	 * @return void
	 */
	public function test_token_refresh_no_refresh_token() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 123;

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andThrow( new RuntimeException( 'Unable to retrieve the refresh token.' ) );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Unable to retrieve the refresh token.' );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Bad_Request_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_bad_request_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Bad_Request_Exception( 'Bad request', 400 ) );

		$this->expectException( Bad_Request_Exception::class );
		$this->expectExceptionMessage( 'Bad request' );
		$this->expectExceptionCode( 400 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_forbidden_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		$this->expectException( Forbidden_Exception::class );
		$this->expectExceptionMessage( 'Forbidden' );
		$this->expectExceptionCode( 403 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Unauthorized_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_unauthorized_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'expired-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Unauthorized_Exception( 'Unauthorized', 401 ) );

		$this->expectException( Unauthorized_Exception::class );
		$this->expectExceptionMessage( 'Unauthorized' );
		$this->expectExceptionCode( 401 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Internal_Server_Error_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_internal_server_error_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Internal_Server_Error_Exception( 'Internal server error', 500 ) );

		$this->expectException( Internal_Server_Error_Exception::class );
		$this->expectExceptionMessage( 'Internal server error' );
		$this->expectExceptionCode( 500 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Not_Found_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_not_found_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Not_Found_Exception( 'Not found', 404 ) );

		$this->expectException( Not_Found_Exception::class );
		$this->expectExceptionMessage( 'Not found' );
		$this->expectExceptionCode( 404 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Payment_Required_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_payment_required_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Payment_Required_Exception( 'Payment required', 402 ) );

		$this->expectException( Payment_Required_Exception::class );
		$this->expectExceptionMessage( 'Payment required' );
		$this->expectExceptionCode( 402 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Request_Timeout_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_request_timeout_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Request_Timeout_Exception( 'Request timeout', 408 ) );

		$this->expectException( Request_Timeout_Exception::class );
		$this->expectExceptionMessage( 'Request timeout' );
		$this->expectExceptionCode( 408 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Service_Unavailable_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_service_unavailable_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Service_Unavailable_Exception( 'Service unavailable', 503 ) );

		$this->expectException( Service_Unavailable_Exception::class );
		$this->expectExceptionMessage( 'Service unavailable' );
		$this->expectExceptionCode( 503 );

		$this->instance->token_refresh( $user );
	}

	/**
	 * Tests token_refresh when request handler throws Too_Many_Requests_Exception.
	 *
	 * @return void
	 */
	public function test_token_refresh_too_many_requests_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;
		$refresh_jwt   = 'valid-refresh-token';

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 123, 'test@example.com' )
			->once()
			->andReturn( $code_verifier );

		$code_verifier
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Too_Many_Requests_Exception( 'Too many requests', 429 ) );

		$this->expectException( Too_Many_Requests_Exception::class );
		$this->expectExceptionMessage( 'Too many requests' );
		$this->expectExceptionCode( 429 );

		$this->instance->token_refresh( $user );
	}
}
