<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Long descriptive test class name.
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for OAuth_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Send_With_Different_Users_Shares_Site_Token_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * The site-level access token is shared across users — two send() calls for different WP users both rely on
	 * MyYoast_Client's own cache (one stored Token_Set, one returned per request). Each call's body carries
	 * that call's WP user id; only the user_id changes between calls.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_two_users_share_site_token_each_carries_own_user_id(): void {
		$user_b     = new WP_User();
		$user_b->ID = 99;

		// MyYoast_Client returns the same cached site token both times — site-wide, not per-user.
		$this->myyoast_client->expects( 'get_site_token' )->twice()->andReturn( $this->token_set, $this->token_set );

		$captured_user_ids = [];
		$this->request_handler->expects( 'handle' )->twice()->andReturnUsing(
			static function ( Request $request ) use ( &$captured_user_ids ): Response {
				$captured_user_ids[] = ( $request->get_body()['user_id'] ?? null );
				return new Response( '{}', 200, 'OK' );
			},
		);

		$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user );
		$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $user_b );

		$this->assertSame( [ '42', '99' ], $captured_user_ids );
	}
}
