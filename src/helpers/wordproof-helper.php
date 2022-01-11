<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for WordProof integration.
 */
class WordProof_Helper {

	/**
	 * Holds the Current Page helper instance.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * Holds the WooCommerce helper instance.
	 *
	 * @var Woocommerce_Helper
	 */
	protected $woocommerce;

	/**
	 * Holds the Options Page helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	public function __construct(Current_Page_Helper $current_page, Woocommerce_Helper $woocommerce, Options_Helper $options) {
		$this->current_page = $current_page;
		$this->woocommerce = $woocommerce;
		$this->options = $options;
	}

	/**
	 * Remove site options after disabling the integration.
	 *
	 * @return bool
	 */
	public function remove_site_options() {
		return delete_site_option( 'wordproof_access_token' )
			&& delete_site_option( 'wordproof_source_id' );
	}

	/**
	 * Return if WordProof should be active for this post editor page.
	 *
	 * @return bool
	 */
	public function is_active() {
		$is_wordproof_active = $this->options->get( 'wordproof_integration_active', true );

		if ( ! $is_wordproof_active )
			return false;

		return ( $this->current_page->current_post_is_privacy_policy() || $this->woocommerce->current_post_is_terms_and_conditions_page() );
	}
}
