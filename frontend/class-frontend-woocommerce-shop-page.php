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

	/** @var int WC shop page id. */
	protected $shop_page_id = null;

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
		add_action( 'wp', array( $this, 'register_hooks_shop_page' ) );
	}

	/**
	 * Registers the hooks if it's WC shop page.
	 */
	public function register_hooks_shop_page() {
		if ( ! $this->is_wc_shop_page() ) {
			return;
		}

		add_filter( 'wpseo_title', array( $this, 'apply_shop_page_title' ) );
		add_filter( 'wpseo_metadesc', array( $this, 'apply_shop_page_metadesc' ) );
		add_filter( 'wpseo_metakeywords', array( $this, 'apply_shop_page_metakeywords' ) );
	}

	/**
	 * Overrides title for shop page.
	 *
	 * @param string $title The current title.
	 *
	 * @return string Title of the shop page if applicable.
	 */
	public function apply_shop_page_title( $title ) {
		return $this->frontend->get_content_title( get_post( $this->get_shop_page_id() ) );
	}

	/**
	 * Overrides the meta description.
	 *
	 * @param string $description The current meta description.
	 *
	 * @return string Meta description of the shop page.
	 */
	public function apply_shop_page_metadesc( $description ) {
		$post_type = $this->get_post_type( $GLOBALS['post'] );

		$metadesc = WPSEO_Meta::get_value( 'metadesc', $this->get_shop_page_id() );
		if ( ( $metadesc === '' && $post_type !== '' ) && isset( $this->frontend->options[ 'metadesc-' . $post_type ] ) ) {
			$metadesc = $this->frontend->options[ 'metadesc-' . $post_type ];

		}

		return trim( wpseo_replace_vars( $metadesc, get_queried_object() ) );
	}

	/**
	 * Overrides the meta keywords.
	 *
	 * @param string $keywords The current meta keywords.
	 *
	 * @return string Meta keywords of the shop page.
	 */
	public function apply_shop_page_metakeywords( $keywords ) {
		$post_type = $this->get_post_type( $GLOBALS['post'] );

		$keywords = WPSEO_Meta::get_value( 'metakeywords', $this->get_shop_page_id() );
		if ( ( $keywords === '' && $post_type !== '' ) && isset( $this->frontend->options[ 'metakey-' . $post_type ] ) ) {
			$keywords = $this->frontend->options[ 'metakey-' . $post_type ];

		}

		return trim( wpseo_replace_vars( $keywords, get_queried_object() ) );
	}

	/**
	 * Determine whether this is the WooCommerce shop page.
	 *
	 * @return bool True if we are on a shop page.
	 */
	protected function is_wc_shop_page() {
		if ( function_exists( 'is_shop' ) && function_exists( 'wc_get_page_id' ) ) {
			return is_shop() && ! is_search();
		}

		return false;
	}

	/**
	 * Returns the page ID of the WooCommerce shop.
	 *
	 * @return int The Page ID of the shop.
	 */
	protected function get_shop_page_id() {
		if ( is_null( $this->shop_page_id ) ) {
			$this->shop_page_id = wc_get_page_id( 'shop' );
		}

		return $this->shop_page_id;
	}

	/**
	 * Gets the post type of the supplied post.
	 *
	 * @param WP_Post|null $post Post to retrieve post type from.
	 *
	 * @return string Post type of the post if applicable.
	 */
	protected function get_post_type( $post ) {
		if ( is_object( $post ) && ! empty( $post->post_type ) ) {
			return $post->post_type;
		}

		return '';
	}
}
