<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_401_Invalid_Token_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * On a 401 without a use_dpop_nonce challenge, the strategy clears the cached site token, re-issues, and
	 * retries once. The fresh token reaches the wire and the retry succeeds.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_clears_site_token_and_retries_on_invalid_token(): void {
		$fresh_token_set = new Token_Set( 'fresh-token', ( \time() + 3600 ), Auth_Token_Type::DPOP );

		$this->myyoast_client->expects( 'get_site_token' )->twice()->andReturn( $this->token_set, $fresh_token_set );
		$this->myyoast_client->expects( 'clear_site_token' )->once();
		$this->myyoast_client->shouldNotReceive( 'store_dpop_nonce' );

		$success = new Response( '{}', 200, 'OK' );

		$this->request_handler->expects( 'handle' )->twice()->andReturnUsing(
			static function ( Request $request ) use ( $success ) {
				static $call = 0;
				++$call;
				if ( $call === 1 ) {
					throw new Unauthorized_Exception( 'invalid_token', 401, 'invalid_token' );
				}
				return $success;
			},
		);

		$this->assertSame( $success, $this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ) );
	}
}
