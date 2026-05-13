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
final class Create_Test extends Abstract_Auth_Strategy_Factory_Test {

	/**
	 * Returns the Token strategy when the feature flag is off, without consulting the MyYoast client.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_returns_token_when_feature_flag_off(): void {
		$this->myyoast_connection_conditional->expects( 'is_met' )->andReturn( false );
		$this->myyoast_client->shouldNotReceive( 'is_registered' );
		$this->myyoast_client->shouldNotReceive( 'is_site_connected' );

		$this->assertInstanceOf( Token_Auth_Strategy::class, $this->instance->create( $this->user ) );
	}
}
