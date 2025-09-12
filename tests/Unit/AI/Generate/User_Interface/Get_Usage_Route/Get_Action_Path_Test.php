<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Get_Usage_Route;

use WPSEO_Addon_Manager;

/**
 * Tests the Get_Usage_Route's get_action_path method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\User_Interface\Get_Usage_Route::get_action_path
 */
final class Get_Action_Path_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the get_action_path method.
	 *
	 * @dataProvider data_get_action_path
	 *
	 * @param bool   $is_woo_product           Whether the request is for a WooCommerce product entity.
	 * @param bool   $has_woo_subscription     Whether the user has a valid WooCommerce subscription.
	 * @param bool   $has_premium_subscription Whether the user has a valid Premium subscription.
	 * @param string $expected                 The expected result.
	 *
	 * @return void
	 */
	public function test_get_action_path( $is_woo_product, $has_woo_subscription, $has_premium_subscription, $expected ) {
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

		$this->assertSame( $expected, $this->instance->get_action_path( $is_woo_product ) );
	}

	/**
	 * Data provider for test_get_action_path.
	 *
	 * @return array<string, array<string, bool|string>>
	 */
	public static function data_get_action_path() {
		return [
			'is Woo product, has valid Woo subscription, has Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => true,
				'premium_subscription' => true,
				'expected'             => '/usage/' . \gmdate( 'Y-m' ),
			],
			'is Woo product, has valid Woo subscription, no Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => true,
				'premium_subscription' => false,
				'expected'             => '/usage/' . \gmdate( 'Y-m' ),
			],
			'is Woo product, no valid Woo subscription, has valid Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => false,
				'premium_subscription' => true,
				'expected'             => '/usage/free-usages',
			],
			'is Woo product, no valid Woo subscription, no valid Premium subscription' => [
				'woo_product'          => true,
				'woo_subscription'     => false,
				'premium_subscription' => false,
				'expected'             => '/usage/free-usages',
			],
			'not Woo product, has valid Woo subscription, has Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => true,
				'premium_subscription' => true,
				'expected'             => '/usage/' . \gmdate( 'Y-m' ),
			],
			'not Woo product, has valid Woo subscription, no Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => true,
				'premium_subscription' => false,
				'expected'             => '/usage/free-usages',
			],
			'not Woo product, no valid Woo subscription, has valid Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => false,
				'premium_subscription' => true,
				'expected'             => '/usage/' . \gmdate( 'Y-m' ),
			],
			'not Woo product, no valid Woo subscription, no valid Premium subscription' => [
				'woo_product'          => false,
				'woo_subscription'     => false,
				'premium_subscription' => false,
				'expected'             => '/usage/free-usages',
			],
		];
	}
}
