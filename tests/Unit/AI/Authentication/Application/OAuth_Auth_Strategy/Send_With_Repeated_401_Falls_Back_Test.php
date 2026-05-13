<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Long descriptive test class name.
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_Repeated_401_Falls_Back_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * When the invalid_token retry also fails with a 401, the strategy falls back to Token_Auth_Strategy
	 * for this single request.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_falls_back_to_token_strategy_after_exhausted_retries(): void {
		$this->myyoast_client->expects( 'get_site_token' )->twice()->andReturn( $this->token_set, $this->token_set );
		$this->myyoast_client->expects( 'clear_site_token' )->once();

		$this->request_handler->expects( 'handle' )->twice()->andThrow( new Unauthorized_Exception( 'invalid_token', 401, 'invalid_token' ) );

		$fallback_response = new Response( '{}', 200, 'OK' );
		$this->token_strategy->expects( 'send' )->once()->andReturn( $fallback_response );

		$this->assertSame(
			$fallback_response,
			$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ),
		);
	}
}
