<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Infrastructure\Endpoints\Bust_Subscription_Cache_Endpoint;

/**
 * Tests the Bust_Subscription_Cache_Endpoint's get_name method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Bust_Subscription_Cache_Endpoint::get_name
 */
final class Get_Name_Test extends Abstract_Bust_Subscription_Cache_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'bustSubscriptionCache', $this->instance->get_name() );
	}
}
