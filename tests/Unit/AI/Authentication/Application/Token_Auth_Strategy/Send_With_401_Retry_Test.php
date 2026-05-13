<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Token_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests for Token_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy
 */
final class Send_With_401_Retry_Test extends Abstract_Token_Auth_Strategy_Test {

	/**
	 * On a 401 response, the strategy clears the stored JWTs and retries once with a freshly-requested token.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_clears_stale_jwts_and_retries_once_on_401(): void {
		$this->token_manager->expects( 'get_or_request_access_token' )->with( $this->user )->twice()->andReturn( 'stale-token', 'fresh-token' );

		$this->user_helper->expects( 'delete_meta' )->with( $this->user->ID, '_yoast_wpseo_ai_generator_access_jwt' )->once();
		$this->user_helper->expects( 'delete_meta' )->with( $this->user->ID, '_yoast_wpseo_ai_generator_refresh_jwt' )->once();

		$success = new Response( '{}', 200, 'OK' );

		$this->request_handler->expects( 'handle' )->twice()->andReturnUsing(
			static function () use ( $success ) {
				static $call = 0;
				++$call;
				if ( $call === 1 ) {
					throw new Unauthorized_Exception( 'unauthorized', 401 );
				}
				return $success;
			},
		);

		$this->assertSame( $success, $this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user ) );
	}
}
