<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Auth_Strategy_Factory;

use Brain\Monkey;

/**
 * Tests for Auth_Strategy_Factory.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory
 */
final class Create_With_Filter_Override_Test extends Abstract_Auth_Strategy_Factory_Test {

	/**
	 * When the wpseo_ai_auth_method filter pins oauth, returns the OAuth strategy directly without
	 * consulting any other gate.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_filter_can_pin_oauth(): void {
		Monkey\Filters\expectApplied( 'wpseo_ai_auth_method' )->andReturn( 'oauth' );
		$this->myyoast_connection_conditional->shouldNotReceive( 'is_met' );
		$this->myyoast_client->shouldNotReceive( 'is_registered' );

		$this->assertSame( $this->oauth_strategy, $this->instance->create( $this->user ) );
	}
}
