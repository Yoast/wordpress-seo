<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 */
class WPSEO_WooCommerce_Shop_Page implements WPSEO_WordPress_Integration {

	/**
	 * @var int Holds the shop page id.
	 */
	protected static $shop_page_id;

	/**
	 * @var bool Is current page the shop page?
	 */
	protected static $is_shop_page;

	/**
	 * Registers the hooks
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_woo_activated() ) {
			return;
		}

		add_filter( 'wpseo_frontend_page_type_simple_page_id', array( $this, 'get_page_id' ) );
	}

	/**
	 * Check whether woocommerce plugin is active.
	 *
	 * @return bool
	 */
	private function is_woo_activated() {
		return class_exists( 'WooCommerce', false );
	}

	/**
	 * Returns the ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		if ( ! $this->is_shop_page() ) {
			return $page_id;
		}

		return $this->get_shop_page_id();
	}

	/**
	 * Checks if the current page is the shop page.
	 *
	 * @return bool Whether the current page is the WooCommerce shop page.
	 */
	public function is_shop_page() {
		global $wp_query;

		if ( isset( self::$is_shop_page ) ) {
			return self::$is_shop_page;
		}

		if ( ! isset( $wp_query ) ) {
			return false;
		}

		self::$is_shop_page = false;
		if ( $this->is_woo_activated() && $this->get_shop_page_id() > 0 ) {
			self::$is_shop_page = is_shop() && ! is_search();
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
}
