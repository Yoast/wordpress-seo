<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Token_Auth_Strategy;

use Mockery;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for Token_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy
 */
final class Send_Test extends Abstract_Token_Auth_Strategy_Test {

	/**
	 * Happy path: fetches a token, decorates the request with the Bearer header, and dispatches via the request handler.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_attaches_bearer_header_and_dispatches(): void {
		$this->token_manager->expects( 'get_or_request_access_token' )->with( $this->user )->andReturn( 'jwt-token' );

		$expected_response = new Response( '{}', 200, 'OK' );

		$this->request_handler->expects( 'handle' )->with(
			Mockery::on(
				static function ( Request $request ): bool {
					$headers = $request->get_headers();
					return ( ( $headers['Authorization'] ?? null ) === 'Bearer jwt-token' )
						&& $request->get_action_path() === '/openai/suggestions/seo-title';
				},
			),
		)->andReturn( $expected_response );

		$this->assertSame( $expected_response, $this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ) );
	}
}
