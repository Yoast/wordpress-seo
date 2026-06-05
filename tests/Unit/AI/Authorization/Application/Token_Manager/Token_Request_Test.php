<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Token_Manager;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier;

/**
 * Class Token_Request_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_request
 */
final class Token_Request_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests token_request when the request succeeds.
	 *
	 * @return void
	 */
	public function test_token_request_success() {
		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 123;
		$user->user_email = 'test@example.com';

		$code_verifier        = Mockery::mock( Code_Verifier::class );
		$code                 = 'test-code-verifier';
		$created_at           = 1_640_995_200;
		$callback_url         = 'https://example.com/callback';
		$refresh_callback_url = 'https://example.com/refresh-callback';

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

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( 123, 'user_meta' )
			->once();

		$this->instance->token_request( $user );
	}
}
