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
	 * Holds the import object
	 *
	 * @var object
	 */
	private $import;

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Handle premium imports.
		add_filter( 'wpseo_handle_import', array( $this, 'do_premium_imports' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_redirect_import_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'redirects_import_header' ) );
	}

	/**
	 * Do premium imports
	 *
	 * @param object|bool $import The import object.
	 *
	 * @return object
	 */
	public function do_premium_imports( $import ) {
		if ( ! $import ) {
			$import = (object) array(
				'msg'     => '',
				'success' => false,
			);
		}
		$this->import = $import;
		$this->htaccess_import();
		$this->do_plugin_imports();
		return $this->import;
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
	 */
	public function add_redirect_import_block() {
		// The plugins we have import functions for.
		$plugins = array(
			'redirection'           => __( 'Redirection', 'wordpress-seo-premium' ) . '<br/>',
			'safe_redirect_manager' => __( 'Safe Redirect Manager', 'wordpress-seo-premium' ) . '<br/>',
			'simple-301-redirects'  => __( 'Simple 301 Redirects', 'wordpress-seo-premium' ) . '<br/>',
		);

		// Display the forms.
		require( 'views/import-redirects.php' );
	}

	/**
	 * Redirection import success message
	 */
	private function message_redirect_import_success() {
		$this->import->msg .= __( 'Redirects have been imported.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection plugin not found message
	 */
	private function message_redirection_plugin_not_find() {
		$this->import->msg .= __( 'Redirect import failed: Redirection plugin not installed or activated.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection import no redirects found message
	 */
	private function message_redirect_import_no_redirects() {
		$this->import->msg .= __( 'Redirect import failed: No redirects found.', 'wordpress-seo-premium' );
	}

	/**
	 * Apache import success message
	 */
	private function message_htaccess_success() {
		/* translators: %s: '.htaccess' file name */
		$this->import->msg .= sprintf( __( '%s redirects have been imported.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Apache import no redirects found message
	 */
	private function message_htaccess_no_redirects() {
		/* translators: %s: '.htaccess' file name */
		$this->import->msg .= sprintf( __( '%s import failed: No redirects found.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Do .htaccess file import.
	 *
	 * @return void
	 */
	private function htaccess_import() {
		$htaccess = stripcslashes( filter_input( INPUT_POST, 'htaccess' ) );
		if ( ! $htaccess || '' === $htaccess ) {
			return;
		}

		// Regexpressions.
		$regex_patterns = array(
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) ([^"\s]+) ([a-z0-9-_+/.:%&?=#\][]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) "([^"]+)" ([a-z0-9-_+/.:%&?=#\][]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect (410) ([^"\s]+)`im', // Matches a redirect without a target.
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect (410) "([^"]+)"`im', // Matches a redirect without a target.
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) ([^"\s]+) ([^\s]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) "?([^"]+)"? ([^\s]+)`im',
			),
		);

		// Loop through patterns.
		foreach ( $regex_patterns as $regex ) {
			// Get all redirects.
			$redirects = $this->match_redirect_regex( $regex['pattern'], $htaccess );

			$this->save_redirects_from_regex( $redirects, $regex['type'] );
		}

		// Check if we've imported any redirects.
		if ( $this->redirects_imported ) {
			$this->save_import();

			// Display success message.
			$this->import->success = true;
			$this->message_htaccess_success();

			return;
		}

		// Display fail message.
		$this->message_htaccess_no_redirects();
	}

	/**
	 * Matches the string (containing redirects) for the given regex
	 *
	 * @param string $pattern   The regular expression to match redirects.
	 * @param string $htaccess  The string of redirects.
	 *
	 * @return mixed;
	 */
	protected function match_redirect_regex( $pattern, $htaccess ) {
		preg_match_all( $pattern, $htaccess, $redirects, PREG_SET_ORDER );

		return $redirects;
	}

	/**
	 * Saves all the given redirects.
	 *
	 * @param mixed  $redirects The redirects to save.
	 * @param string $format    The format for the redirects.
	 */
	protected function save_redirects_from_regex( $redirects, $format ) {
		if ( ! is_array( $redirects ) ) {
			return;
		}

		$types_needs_target = array( '410' );

		foreach ( $redirects as $redirect ) {
			$type   = trim( $redirect[1] );
			$source = trim( $redirect[2] );
			$target = '';

			if ( ! in_array( $type, $types_needs_target, true ) ) {
				$target = trim( $redirect[3] );

				// There is no target, skip it.
				if ( $target === '' ) {
					continue;
				}
			}
			if ( '' !== $source ) {
				// Adding the redirect to importer class.
				$this->get_redirect_option()->add( new WPSEO_Redirect( $source, $target, $type, $format ) );
				$this->redirects_imported = true;
			}
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
					$success = $this->redirection_import();
					break;
				case 'safe_redirect_manager':
					$success = $this->safe_redirect_import();
					break;
				case 'simple-301-redirects':
					$success = $this->simple_301_redirects_import();
					break;
				default:
					$success = false;
					break;
			}
			if ( $success ) {
				// Add success message.
				$this->message_redirect_import_success();
				$this->import->success = true;

				// Save and export the redirects.
				$this->save_import();
				return;
			}
			$this->message_redirect_import_no_redirects();
		}
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
			$this->message_redirection_plugin_not_find();
			return false;
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
	 * Do a safe redirect manager (https://wordpress.org/plugins/safe-redirect-manager/) import.
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

				// Special case for safe redirect wildcard system.
				if ( substr( $item['redirect_from'], - 1, 1 ) === '*' ) {
					$item['redirect_from'] = preg_replace( '/(\*)$/', '.*', $item['redirect_from'] );
					$item['enable_regex']  = 1;
				}

				if ( 1 === (int) $item['enable_regex'] ) {
					$format = WPSEO_Redirect::FORMAT_REGEX;
				}

				// Safe redirect manager has support for 404 and 403 status codes, we don't, so let's bend them to 410's.
				// Also, it supports 303's, which we change into 302's.
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
	 * Do Simple 301 redirects (https://wordpress.org/plugins/simple-301-redirects/) import.
	 *
	 * @return bool
	 */
	private function simple_301_redirects_import() {
		// Get redirects.
		$redirects = get_option( '301_redirects' );

		// Whether to use wildcards.
		$wildcard = get_option( '301_redirects_wildcard' );

		// Loop and add redirect to Yoast SEO Premium.
		if ( count( $redirects ) > 0 ) {
			foreach ( $redirects as $origin => $target ) {
				$format = WPSEO_Redirect::FORMAT_PLAIN;

				// If wildcard redirects had been used, and this is one, flip it.
				if ( $wildcard && strpos( $origin, '*' ) !== false ) {
					$format = WPSEO_Redirect::FORMAT_REGEX;
					$origin = str_replace( '*', '(.*)', $origin );
					$target = str_replace( '*', '$1', $target );
				}

				$this->get_redirect_option()->add( new WPSEO_Redirect( $origin, $target, 301, $format ) );
				$this->redirects_imported = true;
			}
			return true;
		}
		return false;
	}
}
