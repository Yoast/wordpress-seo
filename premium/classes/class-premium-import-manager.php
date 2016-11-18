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
		// Handle premium imports.
		add_action( 'wpseo_handle_import', array( $this, 'do_premium_imports' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_redirect_import_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'redirects_import_header' ) );
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

		$this->do_plugin_imports();
	}

	/**
	 * Save and export the redirects.
	 */
	private function save_import() {
		$this->get_redirect_option()->save();
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect_manager->export_redirects();
	}

	/**
	 * Handle plugin imports
	 */
	private function do_plugin_imports() {
		$wpseo_post = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		if ( isset( $wpseo_post['import_plugin'] ) ) {
			switch ( $wpseo_post['import_plugin'] ) {
				case 'redirection':
					$return = $this->redirection_import();
					break;
				case 'safe_redirect_manager':
					$return = $this->safe_redirect_import();
					break;
				default:
					$return = false;
					break;
			}
			if ( $return ) {
				// Add success message.
				add_filter( 'wpseo_import_message', array( $this, 'message_redirect_import_success' ) );
				add_filter( 'wpseo_import_status', '__return_true' );
				// Save and export the redirects.
				$this->save_import();
			}
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
		// The htaccess post.
		$htaccess = stripcslashes( $htaccess );

		// Regexpressions.
		$regex_patterns = array(
			array(
				'type' => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) ([^"\s]+) ([a-z/:%&#]+)`im',
			),
			array(
				'type' => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) "([^"]+)" ([a-z/:%&#]+)`im',
			),
			array(
				'type' => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) ([^"\s]+) ([^\s]+)`im',
			),
			array(
				'type' => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) "?([^"]+)"? ([^\s]+)`im',
			),
		);

		// Loop through patterns.
		foreach ( $regex_patterns as $regex ) {
			// Get all redirects.
			if ( preg_match_all( $regex['pattern'], $htaccess, $redirects, PREG_SET_ORDER ) ) {

				echo '<pre>' . print_r( $redirects, 1 ) . '</pre>';

				if ( count( $redirects ) > 0 ) {
					foreach( $redirects as $redirect ) {
						$type   = trim( $redirect[1] );
						$source = trim( $redirect[2] );
						$target = trim( $redirect[3] );

						if ( '' !== $source && '' !== $target ) {
							// Adding the redirect to importer class.
							$this->get_redirect_option()->add( new WPSEO_Redirect( $source, $target, $type, $regex['type'] ) );
							$this->redirects_imported = true;
						}
					}
				}
			}
		}

		// Check if we've imported any redirects.
		if ( $this->redirects_imported ) {
			$this->save_import();

			// Display success message.
			add_filter( 'wpseo_import_status', '__return_true' );
			add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_success' ) );
			return true;
		}

		// Display fail message.
		add_filter( 'wpseo_import_message', array( $this, 'message_htaccess_no_redirects' ) );
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
			return true;
		}
		return false;
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
				// Also, it supports 303's, which we change into 302's
				switch ( $item['status_code'] ) {
					case 303:
						$status_code = 302;
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
			return true;
		}
		return false;
	}

	/**
	 * Outputs a tab header for the htaccess import block
	 */
	public function redirects_import_header() {
		/* translators: %s: '.htaccess' file name */
		echo '<a class="nav-tab" id="import-htaccess-tab" href="#top#import-htaccess">' . __( 'Import redirects', 'wordpress-seo-premium' ) . '</a>';
	}

	/**
	 * Adding the import block for htaccess. Makes it able to import redirects from htaccess
	 *
	 * @param array $admin_object Unused.
	 */
	public function add_redirect_import_block( $admin_object ) {

		// Attempt to load the htaccess file.
		$textarea_value = '';
		if ( 1 || WPSEO_Utils::is_apache() ) {
			if ( file_exists( ABSPATH . '.htaccess' ) ) {
				$textarea_value = file_get_contents( ABSPATH . '.htaccess' );
			}
		}

		// Display the form.
		echo '<div id="import-htaccess" class="wpseotab">' . PHP_EOL;
		echo '<h2>' . __( 'Import from other redirect plugins', 'wordpress-seo-premium' ) . '</h2>' . PHP_EOL;
		echo '<form action="" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">' . PHP_EOL;
		echo wp_nonce_field( 'wpseo-import', '_wpnonce', true, false );
		$plugins = array(
			'redirection'           => __( 'Redirection', 'wordpress-seo-premium' ) . '<br/>',
			'safe_redirect_manager' => __( 'Safe Redirect Manager', 'wordpress-seo-premium' ) . '<br/>',
		);
		Yoast_Form::get_instance()->radio( 'import_plugin', $plugins, __( 'Import from:', 'wordpress-seo-premium' ) );
		echo '<br/>';
		echo '<input type="submit" class="button button-primary" name="import" value="' . __( 'Import redirects', 'wordpress-seo-premium' ) . '"/>' . PHP_EOL;
		echo '</form>';
		echo '<br/>';
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
