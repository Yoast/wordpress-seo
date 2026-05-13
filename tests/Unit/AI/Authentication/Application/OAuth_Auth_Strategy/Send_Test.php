<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Mockery;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * Happy path: acquires the site token, generates a DPoP proof, attaches the OAuth headers + user_id body,
	 * and dispatches via Request_Handler.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_decorates_request_with_dpop_headers_and_user_id_body(): void {
		$this->myyoast_client->expects( 'get_site_token' )->with( [ 'service:ai:consume' ] )->andReturn( $this->token_set );

		$this->myyoast_client->expects( 'create_dpop_proof' )
			->with( 'POST', 'https://ai.yoa.st/api/v1/openai/suggestions/seo-title', $this->token_set )
			->andReturn( 'proof.signed.jwt' );

		$expected_response = new Response( '{}', 200, 'OK' );

		$this->request_handler->expects( 'handle' )->with(
			Mockery::on(
				function ( Request $request ): bool {
					$headers = $request->get_headers();
					$body    = $request->get_body();
					return ( ( $headers['Authorization'] ?? null ) === 'DPoP opaque-token' )
						&& ( ( $headers['DPoP'] ?? null ) === 'proof.signed.jwt' )
						&& ( ( $body['user_id'] ?? null ) === (string) $this->user->ID );
				},
			),
		)->andReturn( $expected_response );

		$this->assertSame(
			$expected_response,
			$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ),
		);
	}
}
