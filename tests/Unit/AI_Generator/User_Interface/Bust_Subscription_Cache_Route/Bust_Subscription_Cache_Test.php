<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;

use Mockery;
use WP_REST_Response;

/**
 * Tests the Bust_Subscription_Cache_Route's bust_subscription_cache method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route::bust_subscription_cache
 */
final class Bust_Subscription_Cache_Test extends Abstract_Bust_Subscription_Cache_Route_Test {

	/**
	 * Tests the bust_subscription_cache method.
	 *
	 * @return void
	 */
	public function test_bust_subscription_cache() {
		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->addon_manager
			->expects( 'remove_site_information_transients' )
			->once();

		$wp_rest_response
			->expects( '__construct' )
			->with( 'Subscription cache successfully busted.' )
			->once();

		$result = $this->instance->bust_subscription_cache();

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
