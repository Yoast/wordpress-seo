<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Import_Manager
 */
class WPSEO_Premium_Import_Manager {

	/**
	 * Indicates whether redirects where imported
	 *
	 * @var bool
	 */
	private $redirects_imported = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Allow option of importing from other 'other' plugins.
		add_action( 'wpseo_import_other_plugins', array( $this, 'add_premium_import_options' ) );

		// Handle premium imports.
		add_action( 'wpseo_handle_import', array( $this, 'do_premium_imports' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_htaccess_import_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'htaccess_import_header' ) );
	}

	/**
	 * Redirection import success message
	 *
	 * @param string $message The message being added before success notice.
	 *
	 * @return string
	 */
	public function message_redirect_import_success( $message ) {
		return $message . __( 'Redirects have been imported.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection plugin not found message
	 *
	 * @param string $message The message being added before fail notice.
	 *
	 * @return string
	 */
	public function message_redirection_plugin_not_find( $message ) {
		return $message . __( 'Redirect import failed: Redirection plugin not installed or activated.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection import no redirects found message
	 *
	 * @param string $message The message being added before fail notice.
	 *
	 * @return string
	 */
	public function message_redirect_import_no_redirects( $message ) {
		return $message . __( 'Redirect import failed: No redirects found.', 'wordpress-seo-premium' );
	}

	/**
	 * Apache import success message
	 *
	 * @param string $message Unused.
	 *
	 * @return string
	 */
	public function message_htaccess_success( $message ) {
		/* translators: %s: '.htaccess' file name */
		return sprintf( __( '%s redirects have been imported.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Apache import no redirects found message
	 *
	 * @param string $message Unused.
	 *
	 * @return string
	 */
	public function message_htaccess_no_redirects( $message ) {
		/* translators: %s: '.htaccess' file name */
		return sprintf( __( '%s import failed: No redirects found.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Do premium imports
	 */
	public function do_premium_imports() {
		if ( $htaccess = filter_input( INPUT_POST, 'htaccess' ) ) {
			$this->htaccess_import( $htaccess );
		}

		$wpseo_post = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		if ( isset( $wpseo_post['import_redirection'] ) ) {
			$this->redirection_import();
		}
		if ( isset( $wpseo_post['import_safe_redirect'] ) ) {
			$this->safe_redirect_import();
		}

		if ( $this->redirects_imported ) {
			add_filter( 'wpseo_import_status', '__return_true' );
			// Save and export the redirects.
			$this->get_redirect_option()->save();

			$redirect_manager = new WPSEO_Redirect_Manager();
			$redirect_manager->export_redirects();
		}
	}

	/**
	 * Do .htaccess file import.
	 *
	 * @param string $htaccess
	 *
	 * @return bool
	 */
	private function htaccess_import( $htaccess ) {
		global $wp_filesystem;

		// The htaccess post.
		$htaccess = stripcslashes( $htaccess );

		// The new .htaccess file.
		$new_htaccess = $htaccess;

		// Regexpressions.
		$regex_patterns = array(
			WPSEO_Redirect::FORMAT_PLAIN => '`[^# ]Redirect ([0-9]+) ([^\s]+) ([^\s]+)`i',
			WPSEO_Redirect::FORMAT_REGEX => '`[^# ]RedirectMatch ([0-9]+) ([^\s]+) ([^\s]+)`i',
		);

		// Loop through patterns.
		foreach ( $regex_patterns as $regex_type => $regex_pattern ) {
			// Get all redirects.
			if ( preg_match_all( $regex_pattern, $htaccess, $redirects ) ) {

				if ( count( $redirects ) > 0 ) {

					// Loop through redirects.
					for ( $i = 0; $i < count( $redirects[1] ); $i ++ ) {

						// Get source && target.
						$type   = trim( $redirects[1][ $i ] );
						$source = trim( $redirects[2][ $i ] );
						$target = trim( $redirects[3][ $i ] );

						// Check if both source and target are not empty.
						if ( '' !== $source && '' !== $target ) {
							// Adding the redirect to importer class.
							$this->get_redirect_option()->add( new WPSEO_Redirect( $source, $target, $type, $regex_type ) );
							$this->redirects_imported = true;

							// Trim the original redirect.
							$original_redirect = trim( $redirects[0][ $i ] );

							// Comment out added redirect in our new .htaccess file.
							$new_htaccess = str_ireplace( $original_redirect, '#' . $original_redirect, $new_htaccess );
						}
					}
				}
			}
		}

		// Check if we've imported any redirects.
		if ( $this->redirects_imported ) {
			// Set the filesystem URL.
			$url = wp_nonce_url( 'admin.php?page=wpseo_import', 'update-htaccess' );

			// Get the credentials.
			$credentials = request_filesystem_credentials( $url, '', false, ABSPATH );

			// Check if WP_Filesystem is working.
			if ( ! WP_Filesystem( $credentials, ABSPATH ) ) {

				// WP_Filesystem not working, request filesystem credentials.
				request_filesystem_credentials( $url, '', true, ABSPATH );

			} else {
				// Update the .htaccess file.
				$wp_filesystem->put_contents(
					ABSPATH . '.htaccess',
					$new_htaccess,
					FS_CHMOD_FILE // Predefined mode settings for WP files.
				);
			}

			// Display success message.
			add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_success' ) );

		} else {
			// Display fail message.
			add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_no_redirects' ) );
		}
	}

	/**
	 * Redirect option, used to save and fetch the redirects.
	 *
	 * @return WPSEO_Redirect_Option
	 */
	private function get_redirect_option() {
		static $redirect_option;

		if ( ! $redirect_option ) {
			$redirect_option = new WPSEO_Redirect_Option();
		}

		return $redirect_option;
	}

	/**
	 * Do redirection(http://wordpress.org/plugins/redirection/) import.
	 *
	 * @return bool
	 */
	private function redirection_import() {
		global $wpdb;

		// Only do import if Redirections is active.
		if ( ! defined( 'REDIRECTION_VERSION' ) ) {
			// Add plugin not found message.
			add_filter( 'wpseo_import_message', array( $this, 'message_redirection_plugin_not_find' ) );

			return;
		}

		// Get redirects.
		$items = $wpdb->get_results( "SELECT `url`, `action_data`, `regex`, `action_code` FROM {$wpdb->prefix}redirection_items WHERE `status` = 'enabled' AND `action_type` = 'url'" );

		// Loop and add redirect to Yoast SEO Premium.
		if ( count( $items ) > 0 ) {

			foreach ( $items as $item ) {
				$format = WPSEO_Redirect::FORMAT_PLAIN;
				if ( 1 === (int) $item->regex ) {
					$format = WPSEO_Redirect::FORMAT_REGEX;
				}

				$this->get_redirect_option()->add( new WPSEO_Redirect( $item->url, $item->action_data, $item->action_code, $format ) );
				$this->redirects_imported = true;
			}

			// Add success message.
			add_filter( 'wpseo_import_message', array( $this, 'message_redirect_import_success' ) );
		} else {
			// Add no redirects found message.
			add_filter( 'wpseo_import_message', array( $this, 'message_redirect_import_no_redirects' ) );
		}
	}

	/**
	 * Do redirection(http://wordpress.org/plugins/redirection/) import.
	 *
	 * @return bool
	 */
	private function safe_redirect_import() {
		// Get redirects.
		$items = get_transient( '_srm_redirects' );

		// Loop and add redirect to Yoast SEO Premium.
		if ( count( $items ) > 0 ) {

			foreach ( $items as $item ) {
				$format = WPSEO_Redirect::FORMAT_PLAIN;

				// Special case for safe redirect wildcard system
				if ( substr( $item['redirect_from'], - 1, 1 ) === '*' ) {
					$item['redirect_from'] = preg_replace( '/(\*)$/', '.*', $item['redirect_from'] );
					$item['enable_regex']  = 1;
				}

				if ( 1 === (int) $item['enable_regex'] ) {
					$format = WPSEO_Redirect::FORMAT_REGEX;
				}

				// Safe redirect manager has support for 404 and 403 status codes, we don't, so let's bend them to 410's.
				// Also, it supports 303's, which we change into 301's
				switch ( $item['status_code'] ) {
					case 303:
						$status_code = 301;
						break;
					case 403:
					case 404:
						$status_code = 410;
						break;
					default:
						$status_code = (int) $item['status_code'];
						break;
				}

				$this->get_redirect_option()->add( new WPSEO_Redirect( $item['redirect_from'], $item['redirect_to'], $status_code, $format ) );
				$this->redirects_imported = true;
			}

			// Add success message.
			add_filter( 'wpseo_import_message', array( $this, 'message_redirect_import_success' ) );
		} else {
			// Add no redirects found message.
			add_filter( 'wpseo_import_message', array( $this, 'message_redirect_import_no_redirects' ) );
		}
	}

	/**
	 * Add premium import options to import list
	 */
	public function add_premium_import_options() {
		Yoast_Form::get_instance()->checkbox( 'import_redirection', __( 'Import from Redirection', 'wordpress-seo-premium' ) );
		Yoast_Form::get_instance()->checkbox( 'import_safe_redirect', __( 'Import from Safe Redirect Manager', 'wordpress-seo-premium' ) );

	}

	/**
	 * Outputs a tab header for the htaccess import block
	 */
	public function htaccess_import_header() {
		/* translators: %s: '.htaccess' file name */
		echo '<a class="nav-tab" id="import-htaccess-tab" href="#top#import-htaccess">' . sprintf( __( '%s import', 'wordpress-seo-premium' ), '.htaccess' ) . '</a>';
	}

	/**
	 * Adding the import block for htaccess. Makes it able to import redirects from htaccess
	 *
	 * @param array $admin_object Unused.
	 */
	public function add_htaccess_import_block( $admin_object ) {

		// Attempt to load the htaccess file.
		$textarea_value = '';
		if ( 1 || WPSEO_Utils::is_apache() ) {
			if ( file_exists( ABSPATH . '.htaccess' ) ) {
				$textarea_value = file_get_contents( ABSPATH . '.htaccess' );
			}
		}

		// Display the form.
		echo '<div id="import-htaccess" class="wpseotab">' . PHP_EOL;
		/* translators: %s: '.htaccess' file name */
		echo '<h2>' . sprintf( __( 'Import redirects from %s', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . '</h2>' . PHP_EOL;
		/* translators: %1$s: '.htaccess' file name, %2$s plugin name */
		echo '<p>' . sprintf( __( 'You can copy the contents of any %1$s file in here, and it will import the redirects into %2$s.', 'wordpress-seo-premium' ), '<code>.htaccess</code>', 'Yoast SEO Premium' ) . '</p>' . PHP_EOL;
		echo '<form action="" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">' . PHP_EOL;
		echo wp_nonce_field( 'wpseo-import', '_wpnonce', true, false );

		echo '<label for="htaccess" class="screen-reader-text">' . __( 'Enter redirects to import', 'wordpress-seo-premium' ) . '</label>';
		echo '<textarea name="htaccess" id="htaccess" rows="15" class="large-text code">' . $textarea_value . '</textarea><br/>' . PHP_EOL;
		echo '<input type="submit" class="button button-primary" name="import" value="' . __( 'Import .htaccess', 'wordpress-seo-premium' ) . '"/>' . PHP_EOL;
		echo '</form>' . PHP_EOL;
		echo '</div>' . PHP_EOL;
	}
}
