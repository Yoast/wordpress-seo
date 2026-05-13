<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_Token_Request_Failed_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * When the initial site-token issuance fails, the strategy delegates this request to Token_Auth_Strategy
	 * without dispatching anything itself.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_falls_back_when_get_site_token_throws(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andThrow( new Token_Request_Failed_Exception( 'invalid_client', 'Client authentication failed.' ) );

		$this->request_handler->shouldNotReceive( 'handle' );

		$fallback_response = new Response( '{}', 200, 'OK' );
		$this->token_strategy->expects( 'send' )->once()->andReturn( $fallback_response );

		$this->assertSame(
			$fallback_response,
			$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ),
		);
	}
}
