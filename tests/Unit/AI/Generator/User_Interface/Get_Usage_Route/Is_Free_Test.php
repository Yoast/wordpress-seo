<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\Get_Usage_Route;

use WPSEO_Addon_Manager;

/**
 * Tests the Get_Usage_Route's is_free method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\Get_Usage_Route::is_free
 */
final class Is_Free_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the is_free method.
	 *
	 * @dataProvider data_is_free
	 *
	 * @param bool $is_woo_product           Whether the request is for a WooCommerce product entity.
	 * @param bool $has_woo_subscription     Whether the user has a valid WooCommerce subscription.
	 * @param bool $has_premium_subscription Whether the user has a valid Premium subscription.
	 * @param bool $expected                 The expected result.
	 *
	 * @return void
	 */
	public function test_is_free( $is_woo_product, $has_woo_subscription, $has_premium_subscription, $expected ) {
		if ( $is_woo_product ) {
			$this->addon_manager
				->expects( 'has_valid_subscription' )
				->once()
				->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
				->andReturn( $has_woo_subscription );
		}
		else {
			$this->addon_manager
				->expects( 'has_valid_subscription' )
				->once()
				->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
				->andReturn( $has_premium_subscription );
		}

		$this->assertSame( $expected, $this->instance->is_free( $is_woo_product ) );
	}

	/**
	 * Data provider for test_is_free.
	 *
	 * A user is on the free tier (is_free === true) exactly when they lack the relevant subscription.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function data_is_free() {
		return [
			'is Woo product, has valid Woo subscription, has Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => true,
				'premium_subscription' => true,
				'expected'             => false,
			],
			'is Woo product, has valid Woo subscription, no Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => true,
				'premium_subscription' => false,
				'expected'             => false,
			],
			'is Woo product, no valid Woo subscription, has valid Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => false,
				'premium_subscription' => true,
				'expected'             => true,
			],
			'is Woo product, no valid Woo subscription, no valid Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => false,
				'premium_subscription' => false,
				'expected'             => true,
			],
			'not Woo product, has valid Woo subscription, has Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => true,
				'premium_subscription' => true,
				'expected'             => false,
			],
			'not Woo product, has valid Woo subscription, no Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => true,
				'premium_subscription' => false,
				'expected'             => true,
			],
			'not Woo product, no valid Woo subscription, has valid Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => false,
				'premium_subscription' => true,
				'expected'             => false,
			],
			'not Woo product, no valid Woo subscription, no valid Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => false,
				'premium_subscription' => false,
				'expected'             => true,
			],
		];
	}
}
