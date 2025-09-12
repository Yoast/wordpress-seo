<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Generator_Integration;

use WPSEO_Addon_Manager;

/**
 * Tests the AI_Generator_Integration's get_product_subscriptions method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\User_Interface\AI_Generator_Integration::get_product_subscriptions
 */
final class Get_Product_Subscriptions_Test extends Abstract_Generator_Integration_Test {

	/**
	 * Tests getting the product subscriptions.
	 *
	 * @return void
	 */
	public function test_get_product_subscriptions() {
		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturn( true );

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->once()
			->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
			->andReturn( true );

		$expected = [
			'premiumSubscription'     => true,
			'wooCommerceSubscription' => true,
		];

		$this->assertSame( $expected, $this->instance->get_product_subscriptions() );
	}
}
