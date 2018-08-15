<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Exposes shortlinks in a global, so that we can pass them to our Javascript components.
 */
class WPSEO_Expose_Shortlinks implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_filter( 'wpseo_admin_l10n', array( $this, 'expose_shortlinks' ) );
	}

	/**
	 * @param array $input The array to add shortlinks to.
	 *
	 * @return array
	 */
	public function expose_shortlinks( $input ) {
		$input['shortlinks.focus_keyword_info']            = WPSEO_Shortlinker::get( 'https://yoa.st/focus-keyword' );
		$input['shortlinks.snippet_preview_info']          = WPSEO_Shortlinker::get( 'https://yoa.st/snippet-preview' );
		$input['shortlinks.cornerstone_content_info']      = WPSEO_Shortlinker::get( 'https://yoa.st/1i9' );

		return $input;
	}
}
