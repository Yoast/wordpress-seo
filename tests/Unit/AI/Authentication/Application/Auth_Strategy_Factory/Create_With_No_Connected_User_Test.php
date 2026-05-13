<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Auth_Strategy_Factory;

use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;

/**
 * Tests for Auth_Strategy_Factory.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory
 */
final class Create_With_No_Connected_User_Test extends Abstract_Auth_Strategy_Factory_Test {

	/**
	 * Returns the Token strategy when no admin on this site has completed the auth-code flow yet — without that,
	 * client_credentials tokens lack the site_url claim and yoast-ai rejects the request.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_returns_token_when_no_user_has_connected(): void {
		$this->myyoast_connection_conditional->expects( 'is_met' )->andReturn( true );
		$this->myyoast_client->expects( 'is_registered' )->andReturn( true );
		$this->myyoast_client->expects( 'is_site_connected' )->andReturn( false );

		$this->assertInstanceOf( Token_Auth_Strategy::class, $this->instance->create( $this->user ) );
	}
}
