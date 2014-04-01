<?php

class WPSEO_Premium_Import_Manager {

	/**
	 * Redirection import success message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_redirection_success( $message ) {
		return $message . __ ( 'Redirection redirects have been imported.', 'wordpress-seo' );
	}

	/**
	 * Redirection plugin not found message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_redirection_plugin_not_find( $message ) {
		return $message . __ ( 'Redirection import failed: Redirection plugin not installed or activated.', 'wordpress-seo' );
	}

	/**
	 * Redirection import no redirects found message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_redirection_no_redirects( $message ) {
		return $message . __ ( 'Redirection import failed: No redirects found.', 'wordpress-seo' );
	}


	/**
	 * Do redirection(http://wordpress.org/plugins/redirection/) import.
	 * We're not importing regex redirects at the moment because we don't support them yet.
	 */
	private function redirection_import() {

		if ( isset( $_POST['wpseo']['import_redirection'] ) ) {
			global $wpdb;

			// Only do import if Redirections is active
			if ( ! defined( 'REDIRECTION_VERSION' ) ) {
				// Add plugin not found message
				add_filter( 'wpseo_import_message', array( $this, 'message_redirection_plugin_not_find' ) );
				return;
			}

			// Get redirects
			$items = $wpdb->get_results( "SELECT `url`, `action_data` FROM {$wpdb->prefix}redirection_items WHERE `status` = 'enabled' AND `action_type` = 'url' AND `regex` = 0" );

			// Loop and add redirect to WordPress Premium
			if ( count( $items ) > 0 ) {
				foreach ( $items as $item ) {
					WPSEO_Redirect_Manager::create_redirect( $item->url, $item->action_data );
				}

				// Add success message
				add_filter( 'wpseo_import_message', array( $this, 'message_redirection_success' ) );
			}else {
				// Add no redirects found message
				add_filter( 'wpseo_import_message', array( $this, 'message_redirection_no_redirects' ) );
			}

		}

	}

	/**
	 * Do premium imports
	 */
	public function do_premium_imports() {
		$this->redirection_import();
	}

	/**
	 * Add premium import options to import list
	 *
	 * @param $content
	 *
	 * @return string
	 */
	public function filter_add_premium_import_options( $content ) {
		global $wpseo_admin_pages;
		$content .= $wpseo_admin_pages->checkbox( 'import_redirection', __( 'Import from Redirection?', 'wordpress-seo' ) );
		return $content;
	}

}