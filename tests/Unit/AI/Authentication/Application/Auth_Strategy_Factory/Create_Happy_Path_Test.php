<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Auth_Strategy_Factory;

/**
 * Tests for Auth_Strategy_Factory.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory
 */
final class Create_Happy_Path_Test extends Abstract_Auth_Strategy_Factory_Test {

	/**
	 * Returns the OAuth strategy directly (no wrapper) when all gates pass — flag on, client
	 * registered, site connected. Runtime fallback stays enabled.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_returns_oauth_when_all_gates_pass(): void {
		$this->myyoast_connection_conditional->expects( 'is_met' )->andReturn( true );
		$this->myyoast_client->expects( 'is_registered' )->andReturn( true );
		$this->myyoast_client->expects( 'is_site_connected' )->andReturn( true );

		$this->assertSame( $this->oauth_strategy, $this->instance->create( $this->user ) );
	}
}
