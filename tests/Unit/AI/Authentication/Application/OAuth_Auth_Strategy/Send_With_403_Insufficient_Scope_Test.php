<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_403_Insufficient_Scope_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * A 403 with insufficient_scope re-throws as a typed Insufficient_Scope_Exception so callers can
	 * distinguish it from a consent-revoked Forbidden_Exception. The strategy does NOT fall back to the
	 * Token strategy because the legacy token has different semantics and would mask a real config
	 * problem. The original response headers are preserved on the new exception.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_throws_insufficient_scope_with_headers_preserved(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andReturn( $this->token_set );

		$original_headers = [
			'www-authenticate' => 'Bearer error="insufficient_scope", scope="service:ai:consume"',
		];
		$this->request_handler->expects( 'handle' )->andThrow( new Forbidden_Exception( 'insufficient_scope', 403, 'insufficient_scope', null, $original_headers ) );

		$this->token_strategy->shouldNotReceive( 'send' );

		try {
			$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user );
			$this->fail( 'Expected Insufficient_Scope_Exception to be thrown.' );
		}
		catch ( Insufficient_Scope_Exception $exception ) {
			$this->assertSame( 'INSUFFICIENT_SCOPE', $exception->get_error_identifier() );
			$this->assertSame( 403, $exception->getCode() );
			$this->assertSame( $original_headers, $exception->get_response_headers() );
		}
	}
}
