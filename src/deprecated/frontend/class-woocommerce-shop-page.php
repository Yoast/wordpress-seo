<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Deprecated\Frontend
 */

use Yoast\WP\SEO\Helpers\Woocommerce_Helper;

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 *
 * @deprecated 14.9
 * @codeCoverageIgnore
 */
class WPSEO_WooCommerce_Shop_Page {

	/**
	 * Checks if the current page is the shop page.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the current page is the WooCommerce shop page.
	 */
	public function is_shop_page() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9', Woocommerce_Helper::class . '::is_shop_page' );

		return YoastSEO()->helpers->woocommerce->is_shop_page();
	}

	/**
	 * Returns the id of the set WooCommerce shop page.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return int The ID of the set page.
	 */
	public function get_shop_page_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9', Woocommerce_Helper::class . '::get_shop_page_id' );

		return YoastSEO()->helpers->woocommerce->get_shop_page_id();
	}

	/**
	 * Returns the ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $page_id;
	}
}
