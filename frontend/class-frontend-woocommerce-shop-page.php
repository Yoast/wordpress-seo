<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Implements SEO Title and Meta Description for WooCommerce Shop page.
 */
class WPSEO_Frontend_WooCommerce_Shop_Page implements WPSEO_WordPress_Integration {
	/** @var WPSEO_Frontend Frontend class. */
	protected $frontend;

	/**
	 * Initializes the class.
	 *
	 * @param WPSEO_Frontend $frontend Frontend instance to use.
	 */
	public function __construct( WPSEO_Frontend $frontend ) {
		$this->frontend = $frontend;
	}

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_filter( 'wpseo_title', array( $this, 'apply_shop_page_title' ) );
		add_filter( 'wpseo_metadesc', array( $this, 'apply_shop_page_metadesc' ) );
	}

	/**
	 * Overrides title for shop page.
	 *
	 * @param string $title The current title.
	 *
	 * @return string Title of the shop page if applicable.
	 */
	public function apply_shop_page_title( $title ) {
		// This check must be done in the filter, as the function is not present when registering hooks.
		if ( ! $this->is_wc_shop_page() ) {
			return $title;
		}

		return $this->frontend->get_content_title( get_post( $this->get_shop_id() ) );
	}

	/**
	 * Overrides the meta description.
	 *
	 * @param string $description The current meta description.
	 *
	 * @return string Meta description of the shop page if applicable.
	 */
	public function apply_shop_page_metadesc( $description ) {
		global $post;

		// This check must be done in the filter, as the function is not present when registering hooks.
		if ( ! $this->is_wc_shop_page() ) {
			return $description;
		}

		$post_type = '';
		if ( is_object( $post ) && ( isset( $post->post_type ) && $post->post_type !== '' ) ) {
			$post_type = $post->post_type;
		}

		$metadesc = WPSEO_Meta::get_value( 'metadesc', $this->get_shop_id() );
		if ( ( $metadesc === '' && $post_type !== '' ) && isset( $this->frontend->options[ 'metadesc-' . $post_type ] ) ) {
			$metadesc = $this->frontend->options[ 'metadesc-' . $post_type ];

		}

		return trim( wpseo_replace_vars( $metadesc, get_queried_object() ) );
	}

	/**
	 * Determine whether this is the WooCommerce shop page.
	 *
	 * @return bool True if we are on a shop page.
	 */
	protected function is_wc_shop_page() {
		if ( function_exists( 'is_shop' ) && function_exists( 'wc_get_page_id' ) ) {
			return is_shop();
		}

		return false;
	}

	/**
	 * Returns the page ID of the WooCommerce shop.
	 *
	 * @return int The Page ID of the shop.
	 */
	protected function get_shop_id() {
		return wc_get_page_id( 'shop' );
	}
}
