<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

/**
 * The Facebook insights class, this will add some listeners to fetch GET params
 */
class Yoast_Social_Facebook {

	/**
	 * @var array    - The options for social
	 */
	private $options;

	/**
	 * @var Yoast_Social_Facebook_Form
	 */
	private $form;

	/**
	 * Setting the options and define the listener to fetch $_GET values
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );

		$this->get_listener();

		$this->form = new Yoast_Social_Facebook_Form();
	}

	/**
	 * Returns the output from the form class
	 */
	public function show_form() {
		$this->form->show_form();
	}

	/**
	 * Adding a new admin
	 *
	 * @param string $admin_name Name string.
	 * @param string $admin_id   ID string.
	 *
	 * @return string
	 */
	public function add_admin( $admin_name, $admin_id ) {
		$success = 0;

		// If one of the fields is empty.
		if ( empty( $admin_name ) || empty( $admin_id ) ) {
			$response_body = $this->get_response_body( 'not_present' );
		}
		else {
			$admin_id = $this->parse_admin_id( $admin_id );

			if ( ! isset( $this->options['fb_admins'][ $admin_id ] ) ) {
				$name     = sanitize_text_field( urldecode( $admin_name ) );
				$admin_id = sanitize_text_field( $admin_id );

				if ( preg_match( '/[0-9]+?/', $admin_id ) && preg_match( '/[\w\s]+?/', $name ) ) {
					$this->options['fb_admins'][ $admin_id ]['name'] = $name;
					$this->options['fb_admins'][ $admin_id ]['link'] = urldecode( 'http://www.facebook.com/' . $admin_id );

					$this->save_options();

					$success       = 1;
					$response_body = $this->form->get_admin_link( $admin_id, $this->options['fb_admins'][ $admin_id ] );
				}
				else {
					$response_body = $this->get_response_body( 'invalid_format' );
				}
			}
			else {
				$response_body = $this->get_response_body( 'already_exists' );
			}
		}

		return wp_json_encode(
			array(
				'success' => $success,
				'html'    => $response_body,
			)
		);
	}

	/**
	 * Fetches the id if the full meta tag or a full url was given
	 *
	 * @param string $admin_id Admin ID input string to process.
	 *
	 * @return string
	 */
	private function parse_admin_id( $admin_id ) {
		if ( preg_match( '/^\<meta property\=\"fb:admins\" content\=\"(\d+?)\"/', $admin_id, $matches_full_meta ) ) {
			return $matches_full_meta[1];
		}

		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
		return trim( parse_url( $admin_id, PHP_URL_PATH ), '/' );
	}

	/**
	 * Returns a different response body depending on the response type
	 *
	 * @param string $type Type string.
	 *
	 * @return string
	 */
	private function get_response_body( $type ) {
		switch ( $type ) {
			case 'not_present':
				$return = "<p class='notice-error notice'><span>" . __( 'Please make sure both fields are filled.', 'wordpress-seo' ) . '</span></p>';
				break;
			case 'invalid_format':
				$return = "<p class='notice-error notice'><span>" . __( 'Your input contains invalid characters. Please make sure both fields are filled in correctly.', 'wordpress-seo' ) . '</span></p>';
				break;
			case 'already_exists':
				$return = "<p class='notice-error notice'><span>" . __( 'This Facebook user has already been added as an admin.', 'wordpress-seo' ) . '</span></p>';
				break;
			default:
				$return = '';
				break;
		}

		return $return;
	}

	/**
	 * This method will hook into the defined get params
	 */
	private function get_listener() {
		$delfbadmin = filter_input( INPUT_GET, 'delfbadmin' );
		if ( ! empty( $delfbadmin ) ) {
			$this->delete_admin( $delfbadmin );
		}
		elseif ( filter_input( INPUT_GET, 'fbclearall' ) ) {
			$this->clear_all();
		}
	}

	/**
	 * Deletes the admin from the options
	 *
	 * @param string $delfbadmin Facebook admin ID.
	 */
	private function delete_admin( $delfbadmin ) {
		$this->verify_nonce( 'delfbadmin' );

		$admin_id = sanitize_text_field( $delfbadmin );
		if ( isset( $this->options['fb_admins'][ $admin_id ] ) ) {
			$fbadmin = $this->options['fb_admins'][ $admin_id ]['name'];
			unset( $this->options['fb_admins'][ $admin_id ] );

			$this->save_options();
			/* translators: %s expands to the username of the removed Facebook admin. */
			$this->success_notice( sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ) );

			unset( $fbadmin );
		}

		unset( $admin_id );

		// Clean up the referrer url for later use.
		if ( ! empty( $_SERVER['REQUEST_URI'] ) ) {
			$this->cleanup_referrer_url( 'nonce', 'delfbadmin' );
		}
	}

	/**
	 * Clear all the facebook that has been set already
	 */
	private function clear_all() {
		$this->verify_nonce( 'fbclearall' );

		// Reset to defaults, don't unset as otherwise the old values will be retained.
		$this->options['fb_admins'] = WPSEO_Options::get_default( 'wpseo_social', 'fb_admins' );

		$this->save_options();
		$this->success_notice( __( 'Successfully cleared all Facebook Data', 'wordpress-seo' ) );

		// Clean up the referrer url for later use.
		if ( ! empty( $_SERVER['REQUEST_URI'] ) ) {
			$this->cleanup_referrer_url( 'nonce', 'fbclearall' );
		}
	}

	/**
	 * Clean up the request_uri. The given params are the params that will be removed from the URL
	 */
	private function cleanup_referrer_url() {
		$_SERVER['REQUEST_URI'] = remove_query_arg(
			func_get_args(),
			sanitize_text_field( $_SERVER['REQUEST_URI'] )
		);
	}

	/**
	 * When something is going well, show a success notice
	 *
	 * @param string $notice_text Message string.
	 */
	private function success_notice( $notice_text ) {
		add_settings_error( 'yoast_wpseo_social_options', 'success', $notice_text, 'updated' );
	}

	/**
	 * Verify the nonce from the URL with the saved nonce
	 *
	 * @param string $nonce_name Nonce name string.
	 */
	private function verify_nonce( $nonce_name ) {
		if ( wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), $nonce_name ) != 1 ) {
			die( "I don't think that's really nice of you!." );
		}
	}

	/**
	 * Saving the options
	 */
	private function save_options() {
		update_option( 'wpseo_social', $this->options );
	}
}
