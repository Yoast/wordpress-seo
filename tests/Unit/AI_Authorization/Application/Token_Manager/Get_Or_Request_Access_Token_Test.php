<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Reason: Used for legitimate JWT testing, not obfuscation.
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

/**
 * Class Get_Or_Request_Access_Token_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager::get_or_request_access_token
 */
final class Get_Or_Request_Access_Token_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests get_or_request_access_token when valid non-expired token exists.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_with_valid_token() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 123;

		// Create a non-expired JWT token (expires in the future).
		$future_exp = ( \time() + 3600 ); // 1 hour from now
		$payload    = \base64_encode( \json_encode( [ 'exp' => $future_exp ] ) );
		$access_jwt = "header.{$payload}.signature";

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when no token exists.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_no_token() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$new_access_jwt = 'new-access-token';
		$code_verifier  = Mockery::mock( Code_Verifier::class );
		$code           = 'test-code-verifier';
		$created_at     = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( '' );

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

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

		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $new_access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $new_access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when token is null.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_null_token() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$new_access_jwt = 'new-access-token';
		$code_verifier  = Mockery::mock( Code_Verifier::class );
		$code           = 'test-code-verifier';
		$created_at     = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( null );

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

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

		// Mock URLs.
		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $new_access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $new_access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when token is not a string.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_non_string_token() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$new_access_jwt = 'new-access-token';
		$code_verifier  = Mockery::mock( Code_Verifier::class );
		$code           = 'test-code-verifier';
		$created_at     = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( 123 ); // Non-string value.

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

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

		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $new_access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $new_access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when token exists but is expired and refresh succeeds.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_expired_token_refresh_success() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$new_access_jwt     = 'refreshed-access-token';
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $new_access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $new_access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when token is expired and refresh throws Unauthorized_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_expired_token_refresh_unauthorized() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$new_access_jwt     = 'new-access-token';
		$refresh_jwt        = 'refresh-token';

		$code_verifier_refresh = Mockery::mock( Code_Verifier::class );
		$code_verifier_request = Mockery::mock( Code_Verifier::class );
		$code                  = 'test-code-verifier';
		$created_at            = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $refresh_jwt );

		$this->code_verifier
			->expects( 'generate' )
			->with( 'test@example.com' )
			->once()
			->andReturn( $code_verifier_refresh );

		$code_verifier_refresh
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier_refresh
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

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

		$this->code_verifier
			->expects( 'generate' )
			->with( 'test@example.com' )
			->once()
			->andReturn( $code_verifier_request );

		$code_verifier_request
			->expects( 'get_code' )
			->twice()
			->andReturn( $code );

		$code_verifier_request
			->expects( 'get_created_at' )
			->once()
			->andReturn( $created_at );

		$this->code_verifier_repository
			->expects( 'store_code_verifier' )
			->with( 123, $code, $created_at )
			->once();

		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andReturn( $new_access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $new_access_jwt, $result );
	}

	/**
	 * Tests get_or_request_access_token when token is expired and refresh throws Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_expired_token_refresh_forbidden() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		$this->consent_handler
			->expects( 'revoke_consent' )
			->with( 123 )
			->once();

		$this->expectException( Forbidden_Exception::class );
		$this->expectExceptionMessage( 'CONSENT_REVOKED' );
		$this->expectExceptionCode( 403 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token_request throws Bad_Request_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_token_request_bad_request() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( '' );

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

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

		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andThrow( new Bad_Request_Exception( 'Bad request', 400 ) );

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->expectException( Bad_Request_Exception::class );
		$this->expectExceptionMessage( 'Bad request' );
		$this->expectExceptionCode( 400 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when access_token_repository throws RuntimeException.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_repository_runtime_exception() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( '' );

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_consent', true )
			->once()
			->andReturn( '1' );

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

		$this->urls
			->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh-callback' );

		$this->request_handler
			->expects( 'handle' )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->access_token_repository
			->expects( 'get_token' )
			->with( 123 )
			->once()
			->andThrow( new RuntimeException( 'Unable to retrieve the access token' ) );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Unable to retrieve the access token' );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Internal_Server_Error_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_internal_server_error() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Internal_Server_Error_Exception( 'Internal server error', 500 ) );

		$this->expectException( Internal_Server_Error_Exception::class );
		$this->expectExceptionMessage( 'Internal server error' );
		$this->expectExceptionCode( 500 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Not_Found_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_not_found() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Not_Found_Exception( 'Not found', 404 ) );

		$this->expectException( Not_Found_Exception::class );
		$this->expectExceptionMessage( 'Not found' );
		$this->expectExceptionCode( 404 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Payment_Required_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_payment_required() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Payment_Required_Exception( 'Payment required', 402 ) );

		$this->expectException( Payment_Required_Exception::class );
		$this->expectExceptionMessage( 'Payment required' );
		$this->expectExceptionCode( 402 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Request_Timeout_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_request_timeout() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Request_Timeout_Exception( 'Request timeout', 408 ) );

		$this->expectException( Request_Timeout_Exception::class );
		$this->expectExceptionMessage( 'Request timeout' );
		$this->expectExceptionCode( 408 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Service_Unavailable_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_service_unavailable() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past.
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Service_Unavailable_Exception( 'Service unavailable', 503 ) );

		$this->expectException( Service_Unavailable_Exception::class );
		$this->expectExceptionMessage( 'Service unavailable' );
		$this->expectExceptionCode( 503 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Tests get_or_request_access_token when token refresh throws Too_Many_Requests_Exception.
	 *
	 * @return void
	 */
	public function test_get_or_request_access_token_refresh_too_many_requests() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$expired_time       = ( 1640995200 - 3600 ); // 1 hour in the past
		$expired_access_jwt = $this->create_jwt_token( $expired_time );
		$refresh_jwt        = 'refresh-token';

		$code_verifier = Mockery::mock( Code_Verifier::class );
		$code          = 'test-code-verifier';
		$created_at    = 1640995200;

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $expired_access_jwt );

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
			->once()
			->andThrow( new Too_Many_Requests_Exception( 'Too many requests', 429 ) );

		$this->expectException( Too_Many_Requests_Exception::class );
		$this->expectExceptionMessage( 'Too many requests' );
		$this->expectExceptionCode( 429 );

		$this->instance->get_or_request_access_token( $user );
	}

	/**
	 * Creates a JWT token with the given expiration time.
	 *
	 * @param int $exp The expiration timestamp.
	 * @return string The JWT token.
	 */
	private function create_jwt_token( int $exp ): string {
		$header    = \base64_encode(
			\json_encode(
				[
					'typ' => 'JWT',
					'alg' => 'HS256',
				]
			)
		);
		$payload   = \base64_encode( \json_encode( [ 'exp' => $exp ] ) );
		$signature = \base64_encode( 'fake-signature' );

		return $header . '.' . $payload . '.' . $signature;
	}
}
