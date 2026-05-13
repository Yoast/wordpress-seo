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
final class Send_With_Non_User_Path_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * For paths outside the user-bound set, no user_id field is injected into the request body.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_does_not_inject_user_id_for_non_user_path(): void {
		$this->myyoast_client->expects( 'get_site_token' )->andReturn( $this->token_set );

		$this->request_handler->expects( 'handle' )->with(
			Mockery::on(
				static function ( Request $request ): bool {
					return ! \array_key_exists( 'user_id', $request->get_body() );
				},
			),
		)->andReturn( new Response( '{}', 200, 'OK' ) );

		$this->instance->send( new Request( '/health-check' ), $this->user );
	}
}
