<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Tests for OAuth_Auth_Strategy::on_failure().
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class On_Failure_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * Nonce challenge (use_dpop_nonce + DPoP-Nonce header): stash nonce, return true.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_stores_nonce_on_use_dpop_nonce_challenge(): void {
		$headers = [
			'www-authenticate' => 'DPoP error="use_dpop_nonce", error_description="Authorization server requires nonce"',
			'dpop-nonce'       => 'fresh-nonce-value',
		];

		$this->myyoast_client->expects( 'store_dpop_nonce' )->with( $headers )->once();
		$this->myyoast_client->shouldNotReceive( 'clear_site_token' );

		$retry = $this->instance->on_failure(
			new Request( '/openai/suggestions/seo-title' ),
			$this->user,
			new Unauthorized_Exception( 'use_dpop_nonce', 401, 'use_dpop_nonce', null, $headers ),
			1,
		);

		$this->assertTrue( $retry );
	}

	/**
	 * Plain 401 (no nonce challenge): clear cached site token, return true.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_clears_site_token_on_plain_401(): void {
		$this->myyoast_client->expects( 'clear_site_token' )->once();
		$this->myyoast_client->shouldNotReceive( 'store_dpop_nonce' );

		$retry = $this->instance->on_failure(
			new Request( '/openai/suggestions/seo-title' ),
			$this->user,
			new Unauthorized_Exception( 'invalid_token', 401, 'invalid_token' ),
			1,
		);

		$this->assertTrue( $retry );
	}

	/**
	 * Forbidden with insufficient_scope: throw Insufficient_Scope_Exception (sender propagates, no fallback).
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_throws_insufficient_scope(): void {
		$original_headers = [
			'www-authenticate' => 'Bearer error="insufficient_scope", scope="service:ai:consume"',
		];

		$this->myyoast_client->shouldNotReceive( 'clear_site_token' );
		$this->myyoast_client->shouldNotReceive( 'store_dpop_nonce' );

		try {
			$this->instance->on_failure(
				new Request( '/openai/suggestions/seo-title' ),
				$this->user,
				new Forbidden_Exception( 'insufficient_scope', 403, 'insufficient_scope', null, $original_headers ),
				1,
			);
			$this->fail( 'Expected Insufficient_Scope_Exception.' );
		}
		catch ( Insufficient_Scope_Exception $exception ) {
			$this->assertSame( 'INSUFFICIENT_SCOPE', $exception->get_error_identifier() );
			$this->assertSame( 403, $exception->getCode() );
			$this->assertSame( $original_headers, $exception->get_response_headers() );
		}
	}

	/**
	 * Plain 403 (not insufficient_scope) on the OAuth wire → throw OAuth_Forbidden_Exception so the
	 * sender bypasses fallback and callers don't auto-revoke consent on the user's behalf.
	 * Response headers and the original exception are preserved on the new typed exception.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_throws_oauth_forbidden_for_plain_forbidden(): void {
		$this->myyoast_client->shouldNotReceive( 'clear_site_token' );
		$this->myyoast_client->shouldNotReceive( 'store_dpop_nonce' );

		$original_headers = [ 'x-foo' => 'bar' ];
		$original         = new Forbidden_Exception( 'policy_failure', 403, 'policy_failure', null, $original_headers );

		try {
			$this->instance->on_failure(
				new Request( '/openai/suggestions/seo-title' ),
				$this->user,
				$original,
				1,
			);
			$this->fail( 'Expected OAuth_Forbidden_Exception.' );
		}
		catch ( OAuth_Forbidden_Exception $exception ) {
			$this->assertSame( 'policy_failure', $exception->get_error_identifier() );
			$this->assertSame( 403, $exception->getCode() );
			$this->assertSame( $original_headers, $exception->get_response_headers() );
			$this->assertSame( $original, $exception->getPrevious() );
		}
	}

	/**
	 * Non-auth-related failures (Bad_Request etc.) → return false (sender falls back if it can).
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_returns_false_for_non_auth_failure(): void {
		$retry = $this->instance->on_failure(
			new Request( '/openai/suggestions/seo-title' ),
			$this->user,
			new Bad_Request_Exception( 'OAUTH_TOKEN_UNAVAILABLE', 0, 'OAUTH_TOKEN_UNAVAILABLE' ),
			1,
		);

		$this->assertFalse( $retry );
	}
}
