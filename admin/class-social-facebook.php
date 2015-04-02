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
	 * @var array	- The options for social
	 */
	private $options;

	/**
	 * Setting the options and define the listener to fetch $_GET values
	 *
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );

		$this->get_listener();
	}

	/**
	 * Returns the output from the form class
	 *
	 * @return string
	 */
	public function __toString() {
		$Form = new Yoast_Social_Facebook_Form();

		return $Form->Output();
	}

	/**
	 *	This method will hook into the defined get params
	 *
	 */
	private function get_listener() {
		if ( $delfbadmin = filter_input( INPUT_GET, 'delfbadmin' ) ) {
			$this->delete_admin( $delfbadmin );
		}
		elseif ( filter_input( INPUT_GET, 'fbclearall' ) ) {
			$this->clear_all();
		}
		elseif ( $key = filter_input( INPUT_GET, 'key' ) ) {
			$this->handle_key( $key );
		}
	}

	/**
	 * Deletes the admin from the options
	 *
	 * @param string $delfbadmin
	 */
	private function delete_admin( $delfbadmin ) {
		$this->verify_nonce( 'delfbadmin' );

		$admin_id = sanitize_text_field( $delfbadmin );
		if ( isset( $this->options['fb_admins'][ $admin_id ] ) ) {
			$fbadmin = $this->options['fb_admins'][ $admin_id ]['name'];
			unset( $this->options['fb_admins'][ $admin_id ] );

			$this->save_options();
			$this->success_notice( sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ) );

			unset( $fbadmin );
		}

		unset( $admin_id );

		// Clean up the referrer url for later use
		if ( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) {
			$this->cleanup_referrer_url( 'nonce', 'delfbadmin' );
		}
	}

	/**
	 * Clear all the facebook that has been set already
	 *
	 */
	private function clear_all() {
		$this->verify_nonce( 'fbclearall' );

		// Reset to defaults, don't unset as otherwise the old values will be retained
		$this->options['fb_admins']  = WPSEO_Options::get_default( 'wpseo_social', 'fb_admins' );
		$this->options['fbapps']     = WPSEO_Options::get_default( 'wpseo_social', 'fbapps' );
		$this->options['fbadminapp'] = WPSEO_Options::get_default( 'wpseo_social', 'fbadminapp' );

		$this->save_options();
		$this->success_notice( __( 'Successfully cleared all Facebook Data', 'wordpress-seo' ) );

		// Clean up the referrer url for later use
		if ( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) {
			$this->cleanup_referrer_url( 'nonce', 'fbclearall' );
		}
	}

	/**
	 * Adding a new facebook admin
	 *
	 * @param string $key_value
	 */
	private function handle_key( $key_value ) {
		if ( $key_value === $this->options['fbconnectkey'] && $user_id = filter_input( INPUT_GET, 'userid', FILTER_CALLBACK, array( 'options' => 'sanitize_text_field' ) ) ) {
			if ( ! isset( $this->options['fb_admins'][$user_id] ) ) {
				$this->options['fb_admins'][ $user_id ]['name'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'userrealname' ) ) );
				$this->options['fb_admins'][ $user_id ]['link'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'link' ) ) );

				$this->save_options();
				$this->success_notice(
					sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . esc_url( $this->options['fb_admins'][ $user_id ]['link'] ) . '">' . esc_html( $this->options['fb_admins'][ $user_id ]['name'] ) . '</a>' )
				);
			} else {
				add_settings_error(
					'yoast_wpseo_social_options',
					'error',
					sprintf(
						__( '%s already exists as a Facebook Admin.', 'wordpress-seo' ),
						'<a href="' . esc_url( $this->options['fb_admins'][ $user_id ]['link'] ) . '">' . esc_html( $this->options['fb_admins'][ $user_id ]['name'] ) . '</a>'
					),
					'error'
				);
			}

			unset( $user_id );
		}

		// Clean up the referrer url for later use
		if ( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) {
			$this->cleanup_referrer_url( 'key', 'userid', 'userrealname', 'link' );
		}
	}

	/**
	 * Clean up the request_uri. The given params are the params that will be removed from the URL
	 */
	private function cleanup_referrer_url() {
		$_SERVER['REQUEST_URI'] = remove_query_arg(
			func_get_args(),
			filter_input(
				INPUT_SERVER, 'REQUEST_URI', FILTER_CALLBACK, array( 'options' => 'sanitize_text_field' )
			)
		);
	}

	/**
	 * When something is going well, show a success notice
	 *
	 * @param string $notice_text
	 */
	private function success_notice( $notice_text ) {
		add_settings_error( 'yoast_wpseo_social_options', 'success', $notice_text, 'updated' );
	}

	/**
	 * Verify the nonce from the URL with the saved nonce
	 *
	 * @param string $nonce_name
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

/**
 * This will display the HTML for the facebook insights part
 */
class Yoast_Social_Facebook_Form {

	/**
	 * @var	array	- The options for social
	 */
	private $options;

	/**
	 * @var string	- The HTML output string
	 */
	private $output = '';

	/**
	 * @var array	- The repository for the buttons that will be shown
	 */
	private $buttons = array();

	/**
	 * @var string 	- The app button text
	 */
	private $app_button_text;

	/**
	 * Setting the options and call the methods to display everything
	 *
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );

		$this
			->form_head()
			->app_admin()
			->user_admin()
			->show_buttons();
	}

	/**
	 * Returns the output-property
	 *
	 * @return string
	 */
	public function output() {
		return $this->output;
	}

	/**
	 * SHow the top of the social insights part of the page
	 *
	 * @return $this
	 */
	private function form_head() {
		$this->output = '<p><strong>' . esc_html__( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br />';
		$this->output .= sprintf(
			esc_html__(
				'To be able to access your %sFacebook Insights%s for your site, you need to specify a Facebook Admin. This can be a user, but if you have an app for your site, you could use that. For most people a user will be "good enough" though.', 'wordpress-seo'
			),
			'<a href="https://www.facebook.com/insights">',
			'</a>'
		);
		$this->output .= '</p>';

		return $this;
	}

	/**
	 * Show selectbox with the facebook apps to choose them as an admin
	 *
	 * @return $this
	 */
	private function app_admin() {

		$this->app_button_text = __( 'Use a Facebook App as Admin', 'wordpress-seo' );
		if ( is_array( $this->options['fbapps'] ) && $this->options['fbapps'] !== array() ) {
			// @todo [JRF => whomever] use WPSEO_Admin_Pages->select() method ?
			$this->output .= '<p>' . __( 'Select an app to use as Facebook admin:', 'wordpress-seo' ) . '</p>';
			$this->output .= '<select name="wpseo_social[fbadminapp]" id="fbadminapp">';

			foreach ( $this->options['fbapps'] as $id => $app ) {
				$this->output .= '<option value="' . esc_attr( $id ) . '" ' . selected( $id, $this->options['fbadminapp'], false ) . '>' . esc_attr( $app ) . '</option>';
			}
			unset( $id, $app );

			$this->output .= '</select>';
			$this->output .= '<div class="clear"></div><br/>';

			$this->app_button_text = __( 'Update Facebook Apps', 'wordpress-seo' );
		}

		return $this;
	}

	/**
	 * Display the button to add an admin or add another admin from Facebook
	 *
	 * @return $this
	 */
	private function user_admin() {
		// If there is an app as fb-admin just get out of this method
		if ( $this->options['fbadminapp'] !== 0 ) {
			return $this;
		}

		$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
		$primary     = true;

		if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			$nonce       = wp_create_nonce( 'delfbadmin' );
			$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
			$primary     = false;

			$this->output .= '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
			$this->output .= '<ul>';

			$this->show_user_admins( $nonce );

			$this->output .= '</ul>';

			unset( $admin_id, $admin, $nonce );
		}

		$this->add_button(
			'https://theme.dev/fb-connect/?key=' . urlencode( $this->options['fbconnectkey'] ) . '&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ),
			$button_text,
			( $primary ) ? '-primary' : ''
		);

		return $this;
	}

	/**
	 * Loop through the fb-admins to parse the output for them
	 *
	 * @param string $nonce
	 */
	private function show_user_admins( $nonce ) {
		foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
			$this->output .= '<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a>';
			$this->output .= ' - <strong><a href="' . $this->admin_delete_link( $admin_id, $nonce ) . '">X</a></strong></li>';
		}
	}

	/**
	 * Parsing the link that directs to the admin removal
	 *
	 * @param string $admin_id
	 * @param string $nonce
	 *
	 * @return string
	 */
	private function admin_delete_link( $admin_id, $nonce ) {
		return esc_url(
			add_query_arg(
				array(
					'delfbadmin' => esc_attr( $admin_id ),
					'nonce'      => $nonce,
				),
				admin_url( 'admin.php?page=wpseo_social' )
			)
		);
	}

	/**
	 * Adding a button to the button property
	 *
	 * @param string $button_url
	 * @param string $button_value
	 * @param string $button_class
	 */
	private function add_button( $button_url, $button_value, $button_class = '' ) {
		$this->buttons[] = '<a class="button' . esc_attr( $button_class ) . '" href="' . esc_url( $button_url ) . '">' . esc_html( $button_value ) . '</a>';
	}

	/**
	 * Showing the buttons
	 */
	private function show_buttons() {
		$this->add_button(
			'https://theme.dev/fb-connect/?key=' . urlencode( $this->options['fbconnectkey'] ) . '&type=app&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ),
			$this->app_button_text
		);


		if ( $this->get_clearall() ) {
			$this->add_button(
				esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'fbclearall' ), 'fbclearall' => 'true', ), admin_url( 'admin.php?page=wpseo_social' ) ) ),
				__( 'Clear all Facebook Data', 'wordpress-seo' )
			);
		}

		if ( is_array( $this->buttons ) && $this->buttons !== array() ) {
			$this->output .= '<p class="fb-buttons">' . implode( '', $this->buttons ) . '</p>';
		}
	}

	/**
	 * Check if the clear button should be displayed. This is based on the the set options
	 *
	 * @return bool
	 */
	private function get_clearall() {
		if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			return true;
		}

		if ( is_array( $this->options['fbapps'] ) && $this->options['fbapps'] !== array() ) {
			return true;
		}

		return false;
	}

}