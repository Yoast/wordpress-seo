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
		return $message . __( 'Redirection redirects have been imported.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection plugin not found message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_redirection_plugin_not_find( $message ) {
		return $message . __( 'Redirection import failed: Redirection plugin not installed or activated.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection import no redirects found message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_redirection_no_redirects( $message ) {
		return $message . __( 'Redirection import failed: No redirects found.', 'wordpress-seo-premium' );
	}

	/**
	 * Apache import success message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_htaccess_success( $message ) {
		/* translators: %s: '.htaccess' file name */
		return $message . sprintf( __('%s redirects have been imported.', 'wordpress-seo-premium'), '<code>.htaccess</code>' );
	}

	/**
	 * Apache import no redirects found message
	 *
	 * @param $message
	 *
	 * @return string
	 */
	public function message_htaccess_no_redirects( $message ) {

		/* translators: %s: '.htaccess' file name */
		return $message . sprintf( __( '%s import failed: No redirects found.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Do redirection(http://wordpress.org/plugins/redirection/) import.
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
			$items = $wpdb->get_results( "SELECT `url`, `action_data`, `regex`, `action_code` FROM {$wpdb->prefix}redirection_items WHERE `status` = 'enabled' AND `action_type` = 'url'" );

			// Loop and add redirect to WordPress Premium
			if ( count( $items ) > 0 ) {
				$url_redirection_manager   = new WPSEO_URL_Redirect_Manager();
				$regex_redirection_manager = new WPSEO_REGEX_Redirect_Manager();
				foreach ( $items as $item ) {
					// Check if redirect is a regex redirect
					if ( 1 == $item->regex ) {
						$regex_redirection_manager->create_redirect( $item->url, $item->action_data, $item->action_code );
					} else {
						$url_redirection_manager->create_redirect( $item->url, $item->action_data, $item->action_code );
					}

				}

				// Add success message
				add_filter( 'wpseo_import_message', array( $this, 'message_redirection_success' ) );
			} else {
				// Add no redirects found message
				add_filter( 'wpseo_import_message', array( $this, 'message_redirection_no_redirects' ) );
			}

		}

	}

	/**
	 * Do .htaccess file import.
	 */
	private function htaccess_import() {
		global $wp_filesystem;

		if ( isset( $_POST['htaccess'] ) ) {

			// The htaccess post
			$htaccess = stripcslashes($_POST['htaccess']);

			// The new .htaccess file
			$new_htaccess = $htaccess;

			// Regexpressions
			$regex_patterns = array(
				'url'   => "`[^# ]Redirect ([0-9]+) ([^\s]+) ([^\s]+)`i",
				'regex' => "`[^# ]RedirectMatch ([0-9]+) ([^\s]+) ([^\s]+)`i"
			);

			// Create redirect manager objects
			$url_redirection_manager   = new WPSEO_URL_Redirect_Manager();
			$regex_redirection_manager = new WPSEO_REGEX_Redirect_Manager();

			// Bool if we've imported redirects
			$redirects_imported = false;

			// Loop through patterns
			foreach ( $regex_patterns as $regex_type => $regex_pattern ) {
				// Get all redirects
				if ( preg_match_all( $regex_pattern, $htaccess, $redirects ) ) {

					if ( count( $redirects ) > 0 ) {

						// Loop through redirects
						for ( $i = 0; $i < count( $redirects[1] ); $i ++ ) {

							// Get source && target
							$type   = trim( $redirects[1][ $i ] );
							$source = trim( $redirects[2][ $i ] );
							$target = trim( $redirects[3][ $i ] );

							// Check if both source and target are not empty
							if ( '' != $source && '' != $target ) {

								// Check redirect type
								if ( 'regex' == $regex_type ) {
									$regex_redirection_manager->create_redirect( $source, $target, $type );
								} else {
									$url_redirection_manager->create_redirect( $source, $target, $type );
								}

								$redirects_imported = true;

								// Trim the original redirect
								$original_redirect = trim( $redirects[0][ $i ] );

								// Comment out added redirect in our new .htaccess file
								$new_htaccess = str_ireplace( $original_redirect, '#' . $original_redirect, $new_htaccess );

							}
						}

					}
				}
			}

			// Check if we've imported any redirects
			if ( $redirects_imported ) {

				// Set the filesystem URL
				$url = wp_nonce_url( 'admin.php?page=wpseo_import', 'update-htaccess' );

				// Get the credentials
				$credentials = request_filesystem_credentials( $url, '', false, ABSPATH );

				// Check if WP_Filesystem is working
				if ( ! WP_Filesystem( $credentials, ABSPATH ) ) {

					// WP_Filesystem not working, request filesystem credentials
					request_filesystem_credentials( $url, '', true, ABSPATH );

				} else {

					// Update the .htaccess file
					$wp_filesystem->put_contents(
						ABSPATH . '.htaccess',
						$new_htaccess,
						FS_CHMOD_FILE // predefined mode settings for WP files
					);
				}

				// Display success message
				add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_success' ) );

			} else {
				// Display fail message
				add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_no_redirects' ) );
			}

		}

	}

	/**
	 * Do premium imports
	 */
	public function do_premium_imports() {
		$this->redirection_import();
		$this->htaccess_import();
	}

	/**
	 * Add premium import options to import list
	 *
	 * @param $content
	 *
	 * @return string
	 */
	public function filter_add_premium_import_options( $content ) {
		$content .= Yoast_Form::get_instance()->checkbox( 'import_redirection', __( 'Import from Redirection?', 'wordpress-seo-premium' ) );

		return $content;
	}

	public function add_htaccess_import_block( $admin_object ) {

		// Attemp to load the htaccess file
		$textarea_value = "";
		if ( 1 || WPSEO_Utils::is_apache() ) {
			if ( file_exists( ABSPATH . '.htaccess' ) ) {
				$textarea_value = file_get_contents( ABSPATH . '.htaccess' );
			}
		}

		// Display the form
		echo '<form action="" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">' . PHP_EOL;
		echo wp_nonce_field( 'wpseo-import', '_wpnonce', true, false );

		/* translators: %s: '.htaccess' file name */
		echo '<h2>' . sprintf( __( 'Import redirects from %s', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ). '</h2>' . PHP_EOL;
		echo '<textarea name="htaccess" rows="4" cols="50" style="width:70%; height: 200px;">' . $textarea_value . '</textarea><br/>' . PHP_EOL;
		echo '<input type="submit" class="button-primary" name="import" value="' . __( 'Import .htaccess', 'wordpress-seo-premium' ) . '"/>' . PHP_EOL;
		echo '</form>' . PHP_EOL;
	}

}