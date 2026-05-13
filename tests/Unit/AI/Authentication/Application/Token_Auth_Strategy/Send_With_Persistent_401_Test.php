<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Token_Auth_Strategy;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Tests for Token_Auth_Strategy.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy
 */
final class Send_With_Persistent_401_Test extends Abstract_Token_Auth_Strategy_Test {

	/**
	 * When both the initial call and the retry yield a 401, the exception bubbles up to the caller.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_rethrows_when_retry_also_yields_401(): void {
		$this->token_manager->expects( 'get_or_request_access_token' )->with( $this->user )->twice()->andReturn( 'jwt-1', 'jwt-2' );

		// Each dispatch attempt deletes both stored JWTs, so two attempts = four delete calls.
		$this->user_helper->expects( 'delete_meta' )->times( 4 );

		$this->request_handler->expects( 'handle' )->twice()->andThrow( new Unauthorized_Exception( 'unauthorized', 401 ) );

		$this->expectException( Unauthorized_Exception::class );
		$this->instance->send( new Request( '/openai/suggestions/seo-title' ), $this->user );
	}
}
