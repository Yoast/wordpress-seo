<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_DPoP_Nonce_Challenge_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * On a 401 use_dpop_nonce challenge the strategy stashes the server-issued nonce, regenerates the proof,
	 * and retries once. The second attempt succeeds.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_stashes_nonce_and_retries_once_on_use_dpop_nonce_challenge(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andReturn( $this->token_set );

		$nonce_response_headers = [
			'www-authenticate' => 'DPoP error="use_dpop_nonce", error_description="Authorization server requires nonce in DPoP proof"',
			'dpop-nonce'       => 'fresh-nonce-value',
		];

		$this->myyoast_client->expects( 'store_dpop_nonce' )->with( $nonce_response_headers )->once();
		$this->myyoast_client->shouldReceive( 'create_dpop_proof' )->twice()->andReturn( 'proof-without-nonce', 'proof-with-nonce' );

		$success = new Response( '{}', 200, 'OK' );

		$this->request_handler->expects( 'handle' )->twice()->andReturnUsing(
			static function ( Request $request ) use ( $nonce_response_headers, $success ) {
				static $call = 0;
				++$call;
				if ( $call === 1 ) {
					throw new Unauthorized_Exception( 'use_dpop_nonce', 401, 'use_dpop_nonce', null, $nonce_response_headers );
				}
				return $success;
			},
		);

		$this->assertSame( $success, $this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ) );
	}
}
