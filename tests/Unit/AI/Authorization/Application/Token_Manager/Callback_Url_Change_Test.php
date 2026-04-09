<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Reason: Used for legitimate JWT testing, not obfuscation.
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Token_Manager;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier;

/**
 * Class Callback_Url_Change_Test.
 *
 * Tests that stale AI generator callback URLs are detected and tokens are
 * re-registered when the site URL changes (e.g., migrating from a staging
 * URL to a production domain).
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::get_or_request_access_token
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_request
 */
final class Callback_Url_Change_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests that tokens are deleted and re-requested when the callback URL hash has changed.
	 *
	 * @return void
	 */
	public function test_stale_callback_url_triggers_token_re_request() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$new_access_jwt    = 'new-access-token';
		$new_callback_url  = 'https://example.com/wp-json/yoast/v1/ai_generator/callback';
		$old_callback_hash = \md5( 'https://old-staging.example.com/wp-json/yoast/v1/ai_generator/callback' );
		$code_verifier     = Mockery::mock( Code_Verifier::class );
		$code              = 'test-code-verifier';
		$created_at        = 1_640_995_200;

		// The stored per-user hash differs from the current callback URL hash.
		$this->user_helper
			->shouldReceive( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_callback_url_hash', true )
			->andReturn( $old_callback_hash );

		$this->urls
			->shouldReceive( 'get_callback_url' )
			->andReturn( $new_callback_url );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/wp-json/yoast/v1/ai_generator/refresh_callback' );

		// Stale tokens should be deleted.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		// After deletion, get_meta returns empty — triggers token_request.
		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( '' );

		// token_request flow.
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

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->request_handler
			->expects( 'handle' )
			->once();

		// The new callback URL hash should be stored per-user.
		$this->user_helper
			->expects( 'update_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_callback_url_hash', \md5( $new_callback_url ) )
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
	 * Tests that no action is taken when the callback URL hash matches (URL has not changed).
	 *
	 * @return void
	 */
	public function test_matching_callback_url_hash_does_not_invalidate_tokens() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 123;

		// Create a non-expired JWT token.
		$future_exp = ( \time() + 3600 );
		$payload    = \base64_encode( \json_encode( [ 'exp' => $future_exp ] ) );
		$access_jwt = "header.{$payload}.signature";

		// The stored hash matches the current callback URL hash — setUp defaults handle this.

		// delete_meta should NOT be called — tokens are valid.
		$this->user_helper
			->expects( 'delete_meta' )
			->never();

		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( $access_jwt );

		$result = $this->instance->get_or_request_access_token( $user );

		$this->assertEquals( $access_jwt, $result );
	}

	/**
	 * Tests that tokens are invalidated when no hash is stored (first run after upgrade).
	 *
	 * This forces a fresh token_request() on first use after upgrading, ensuring
	 * existing sites with stale callback URLs self-heal without manual intervention.
	 *
	 * @return void
	 */
	public function test_empty_stored_hash_forces_token_re_request() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$new_access_jwt   = 'new-access-token';
		$new_callback_url = 'https://example.com/wp-json/yoast/v1/ai_generator/callback';
		$code_verifier    = Mockery::mock( Code_Verifier::class );
		$code             = 'test-code-verifier';
		$created_at       = 1_640_995_200;

		// No stored per-user hash — return empty to trigger re-request.
		$this->user_helper
			->shouldReceive( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_callback_url_hash', true )
			->andReturn( '' );

		// Stale tokens should be deleted.
		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		// After deletion, get_meta returns empty — triggers token_request.
		$this->user_helper
			->expects( 'get_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_access_jwt', true )
			->once()
			->andReturn( '' );

		// token_request flow.
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
			->shouldReceive( 'get_callback_url' )
			->andReturn( $new_callback_url );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/wp-json/yoast/v1/ai_generator/refresh_callback' );

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->request_handler
			->expects( 'handle' )
			->once();

		// The new callback URL hash should be stored per-user.
		$this->user_helper
			->expects( 'update_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_callback_url_hash', \md5( $new_callback_url ) )
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
	 * Tests that token_request stores the callback URL hash per-user.
	 *
	 * @return void
	 */
	public function test_token_request_stores_callback_url_hash() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$callback_url         = 'https://example.com/wp-json/yoast/v1/ai_generator/callback';
		$refresh_callback_url = 'https://example.com/wp-json/yoast/v1/ai_generator/refresh_callback';
		$code_verifier        = Mockery::mock( Code_Verifier::class );
		$code                 = 'test-code-verifier';
		$created_at           = 1_640_995_200;

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
			->shouldReceive( 'get_callback_url' )
			->andReturn( $callback_url );

		$this->urls
			->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( $refresh_callback_url );

		// Mock YoastSEO function for WPSEO_Utils::get_home_url().
		$this->WPSEO_Utils_get_home_url();

		$this->request_handler
			->expects( 'handle' )
			->once();

		// Verify the per-user hash is stored after successful token request.
		$this->user_helper
			->expects( 'update_meta' )
			->with( 123, '_yoast_wpseo_ai_generator_callback_url_hash', \md5( $callback_url ) )
			->once();

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		$this->instance->token_request( $user );
	}
}
