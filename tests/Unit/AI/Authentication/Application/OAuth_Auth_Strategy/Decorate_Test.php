<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Proof_Exception;

/**
 * Tests for OAuth_Auth_Strategy::decorate().
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Decorate_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * Happy path: site token + DPoP proof + user_id body for a user-bound path.
	 *
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_attaches_dpop_headers_and_user_id_body(): void {
		$this->myyoast_client->expects( 'get_site_token' )->with( [ 'service:ai:consume' ] )->andReturn( $this->token_set );
		$this->myyoast_client->expects( 'create_dpop_proof' )
			->with( 'POST', 'https://ai.yoa.st/api/v1/openai/suggestions/seo-title', $this->token_set )
			->andReturn( 'proof.signed.jwt' );

		$decorated = $this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $this->user );

		$this->assertSame( 'DPoP opaque-token', ( $decorated->get_headers()['Authorization'] ?? null ) );
		$this->assertSame( 'proof.signed.jwt', ( $decorated->get_headers()['DPoP'] ?? null ) );
		$this->assertSame( '42', ( $decorated->get_body()['user_id'] ?? null ) );
	}

	/**
	 * Non-user-bound paths do not get user_id injected.
	 *
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_does_not_inject_user_id_for_non_user_bound_path(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andReturn( $this->token_set );

		$decorated = $this->instance->decorate( new Request( '/usage/free-usages', [], [], false ), $this->user );

		$this->assertArrayNotHasKey( 'user_id', $decorated->get_body() );
	}

	/**
	 * Two consecutive decorate() calls share the cached site token; each request carries that call's
	 * user id in the body. Verifies the site-wide auth, per-user identity invariant.
	 *
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_shares_site_token_across_users(): void {
		$user_b     = new WP_User();
		$user_b->ID = 99;

		$this->myyoast_client->expects( 'get_site_token' )->twice()->andReturn( $this->token_set, $this->token_set );

		$decorated_a = $this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $this->user );
		$decorated_b = $this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $user_b );

		$this->assertSame( '42', ( $decorated_a->get_body()['user_id'] ?? null ) );
		$this->assertSame( '99', ( $decorated_b->get_body()['user_id'] ?? null ) );
	}

	/**
	 * Token issuance failures are translated into Bad_Request_Exception so the sender treats them as
	 * any other dispatch failure (its on_failure → fallback path engages).
	 *
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_translates_token_request_failure(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andThrow( new Token_Request_Failed_Exception( 'invalid_client', 'Client auth failed.' ) );

		$this->expectException( Bad_Request_Exception::class );
		$this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $this->user );
	}

	/**
	 * DPoP proof failures (crypto / signing) are translated into Bad_Request_Exception.
	 *
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_translates_dpop_proof_failure(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andReturn( $this->token_set );
		$this->myyoast_client->shouldReceive( 'create_dpop_proof' )->andThrow( new DPoP_Proof_Exception( 'crypto failed' ) );

		try {
			$this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $this->user );
			$this->fail( 'Expected Bad_Request_Exception.' );
		}
		catch ( Bad_Request_Exception $exception ) {
			$this->assertSame( 'DPOP_PROOF_FAILED', $exception->get_error_identifier() );
		}
	}
}
