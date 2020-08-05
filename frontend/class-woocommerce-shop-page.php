<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 */
class WPSEO_WooCommerce_Shop_Page {

	/**
	 * Holds the shop page id.
	 *
	 * @var int
	 */
	protected static $shop_page_id;

	/**
	 * True when current page is the shop page.
	 *
	 * @var bool
	 */
	protected static $is_shop_page;

	/**
	 * Determines whether or not WooCommerce is active.
	 *
	 * @return bool True if woocommerce plugin is active.
	 */
	private function is_woocommerce_active() {
		return WPSEO_Utils::is_woocommerce_active();
	}

	/**
	 * Checks if the current page is the shop page.
	 *
	 * @return bool Whether the current page is the WooCommerce shop page.
	 */
	public function is_shop_page() {
		global $wp_query;

		// Prevents too early "caching".
		if ( ! isset( $wp_query ) ) {
			return false;
		}

		if ( ! isset( self::$is_shop_page ) ) {
			self::$is_shop_page = $this->is_woocommerce_active() && is_shop() && ! is_search();
		}

		return self::$is_shop_page;
	}

	/**
	 * Returns the id of the set WooCommerce shop page.
	 *
	 * @return int The ID of the set page.
	 */
	public function get_shop_page_id() {
		if ( ! isset( self::$shop_page_id ) ) {
			self::$shop_page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : ( -1 );
		}

		return self::$shop_page_id;
	}

	/* ********************* DEPRECATED METHODS ********************* */

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
