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
	 */
	public function show_form() {
		$form = new Yoast_Social_Facebook_Form();
		$form->show_form();
	}

	/**
	 * This method will hook into the defined get params
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
			$this->handle_user( $key );
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
	private function handle_user( $key_value ) {
		if ( $key_value === $this->options['fbconnectkey'] && $user_id = filter_input( INPUT_GET, 'userid', FILTER_CALLBACK, array( 'options' => 'sanitize_text_field' ) ) ) {
			if ( ! isset( $this->options['fb_admins'][ $user_id ] ) ) {
				$this->options['fb_admins'][ $user_id ]['name'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'userrealname' ) ) );
				$this->options['fb_admins'][ $user_id ]['link'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'link' ) ) );

				$this->save_options();
				$this->success_notice(
					sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . esc_url( $this->options['fb_admins'][ $user_id ]['link'] ) . '">' . esc_html( $this->options['fb_admins'][ $user_id ]['name'] ) . '</a>' )
				);
			}
			else {
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
	 * @var array	- The repository for the buttons that will be shown
	 */
	private $buttons = array();

	/**
	 * @var string	- The URL to link to
	 */
	private $admin_url = 'admin.php?page=wpseo_social';

	/**
	 * Setting the options and call the methods to display everything
	 *
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );
	}

	/**
	 * Returns the output-property
	 */
	public function show_form() {
		$this
			->form_head()
			->manage_user_admin()
			->show_buttons()
			->manage_app_as_admin();
	}

	/**
	 * SHow the top of the social insights part of the page
	 *
	 * @return $this
	 */
	private function form_head() {
		echo '<p><strong>' . esc_html__( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br />';
		echo sprintf(
			esc_html__(
				'To be able to access %sFacebook Insights%s for your site, you need to specify a Facebook Admin. This can be a user. If you have an app for your site, you could use that as well.', 'wordpress-seo'
			),
			'<a href="https://www.facebook.com/insights">',
			'</a>'
		);
		echo'</p>';

		return $this;
	}

	/**
	 * Display the buttons to add an admin or add another admin from Facebook and display the admin that has been added already.
	 *
	 * @return $this
	 */
	private function manage_user_admin() {
		$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );

		if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			$nonce       = wp_create_nonce( 'delfbadmin' );
			$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );

			echo '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
			echo '<ul>';
				$this->show_user_admins( $nonce );
			echo '</ul>';

			unset( $admin_id, $admin, $nonce );
		}

		$this->add_button(
			'https://yoast.com/fb-connect/?key=' . urlencode( $this->options['fbconnectkey'] ) . '&redirect=' . urlencode( admin_url( $this->admin_url ) ),
			$button_text,'',
			true
		);

		return $this;
	}

	/**
	 * Show input field to set a facebook apps as an admin
	 *
	 * @return $this
	 */
	private function manage_app_as_admin() {
		echo '<div class="clear"></div><br />';
		Yoast_Form::get_instance()->textinput( 'fbadminapp', __( 'Facebook App ID', 'wordpress-seo' ) );

		return $this;
	}

	/**
	 * Loop through the fb-admins to parse the output for them
	 *
	 * @param string $nonce
	 */
	private function show_user_admins( $nonce ) {
		foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
			echo '<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a>';
			echo ' - <strong><a href="' . $this->admin_delete_link( $admin_id, $nonce ) . '">X</a></strong></li>';
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
				admin_url( $this->admin_url . '#top#facebook' )
			)
		);
	}

	/**
	 * Adding a button to the button property
	 *
	 * @param string $button_url
	 * @param string $button_value
	 * @param string $button_class
	 * @param string $button_id
	 */
	private function add_button( $button_url, $button_value, $button_class = '', $button_id = '' ) {
		$this->buttons[] = '<a id="' .esc_attr( $button_id ). '" class="button' . esc_attr( $button_class ) . '" href="' . esc_url( $button_url ) . '">' . esc_html( $button_value ) . '</a>';
	}

	/**
	 * Showing the buttons
	 */
	private function show_buttons() {
		if ( $this->get_clearall() ) {
			$this->add_button(
				esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'fbclearall' ), 'fbclearall' => 'true', ), admin_url( $this->admin_url . '#top#facebook' ) ) ),
				__( 'Clear all Facebook Data', 'wordpress-seo' )
			);
		}

		if ( is_array( $this->buttons ) && $this->buttons !== array() ) {
			echo '<p class="fb-buttons">' . implode( '', $this->buttons ) . '</p>';
		}

		return $this;
	}

	/**
	 * Check if the clear button should be displayed. This is based on the the set options
	 *
	 * @return bool
	 */
	private function get_clearall() {
		return is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array();
	}

}