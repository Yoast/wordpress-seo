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
	public function current_page_is_privacy_policy() {
		global $post;

		$privacyPolicyPostId = intval( \get_site_option( 'wp_page_for_privacy_policy', false ) );
		return $post->ID === $privacyPolicyPostId;
	}
}
