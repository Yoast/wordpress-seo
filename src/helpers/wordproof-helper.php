<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for WordProof integration.
 */
class WordProof_Helper {

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
	 * Retrieves the site privacy policy page id.
	 *
	 * @return string
	 */
	public function get_privacy_policy_page_id() {
		return intval( \get_site_option( 'wp_page_for_privacy_policy', false ) );
	}
}
