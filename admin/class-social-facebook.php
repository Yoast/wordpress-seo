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
	 * @var Yoast_Social_Facebook_Form
	 */
	private $form;

	/**
	 * Setting the options and define the listener to fetch $_GET values
	 *
	 */
	public function __construct() {
		$this->options = get_option( 'wpseo_social' );

		$this->get_listener();

		$this->form    = new Yoast_Social_Facebook_Form();
	}

	/**
	 * Returns the output from the form class
	 *
	 */
	public function show_form() {
		$this->form->show_form();
	}

	/**
	 * Adding a new admin
	 * @param string $admin_name
	 * @param string $admin_id
	 */
	public function add_admin( $admin_name, $admin_id ) {
		// If one of the fields is empty
		if ( empty( $admin_name ) || empty( $admin_id ) ) {
			return json_encode(
				array(
					'success' => 0,
					'html'    => "<p class='notice-error notice'><span style='margin-left: 5px'>" . __( 'Please make sure both fields are filled.', 'wordpress-seo' ) . '</span></p>',
				)
			);
		}

		// Fetch the id if the full meta tag was given
		if ( preg_match( '/^\<meta property\=\"fb:admins\" content\=\"(\d+?)\"/', $admin_id, $matches_full_meta ) ) {
			$admin_id = $matches_full_meta[1];
		}
		else {
			// Clean up the url part if a full url was given
			$admin_id = trim( parse_url( $admin_id, PHP_URL_PATH ), '/' );
		}

		if ( ! isset( $this->options['fb_admins'][ $admin_id ] ) ) {
			$name = sanitize_text_field( urldecode( $admin_name ) );
			$link = sanitize_text_field( urldecode( 'http://www.facebook.com/' . $admin_id ) );

			if ( ! empty( $admin_id ) && ! empty( $name ) && ! empty( $link ) ) {
				$this->options['fb_admins'][ $admin_id ]['name'] = $name;
				$this->options['fb_admins'][ $admin_id ]['link'] = $link;

				$this->save_options();

				$return = array(
					'success' => 1,
					'html'    => $this->form->get_admin_link( $admin_id, $this->options['fb_admins'][ $admin_id ] ),
				);
			}
			else {
				$return = array(
					'success' => 0,
					'html'    => "<p class='notice-error notice'><span style='margin-left: 5px'>" . __( 'Please make sure both fields are filled in correctly.', 'wordpress-seo' ) . '</span></p>',
				);
			}
		}
		else {
			$return = array(
				'success' => 0,
				'html'    => "<p class='notice-error notice'><span style='margin-left: 5px'>" . __( 'This Facebook user has already been added as an admin.', 'wordpress-seo' ) . '</span></p>',
			);
		}

		return json_encode( $return );
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
			->form_thickbox()
			->show_buttons()
			->manage_app_as_admin();
	}

	/**
	 * Parses the admin_link
	 *
	 * @param string      $admin_id
	 * @param array 	  $admin
	 * @param string|bool $nonce
	 *
	 * @return string
	 */
	public function get_admin_link( $admin_id, $admin, $nonce = false ) {
		if ( $nonce === false ) {
			$nonce = $this->get_delete_nonce();
		}

		$return  = '<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a>';
		$return .= ' - <strong><a href="' . $this->admin_delete_link( $admin_id, $nonce ) . '">X</a></strong></li>';

		return $return;
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
	 *
	 */
	private function form_thickbox() {
		// Adding the thickbox
		add_thickbox();

		echo '<div id="add_facebook_admin" style="display:none;">';
		echo "<div class='form-wrap wpseo_content_wrapper'>";
		echo '<h3>' .  __( 'Add Facebook admin', 'wordpress-seo' ) . '</h3>';

		echo '<div class="form-field form-required">';
		echo '<label>' . __( 'Name of the admin:', 'wordpress-seo' ) . '</label>';
		echo '<input type="text" name="fb_admin_name" value="" maxlength="255" />';
		echo '</div>';
		echo '<div class="form-field form-required">';
		echo '<label>' . __( 'UserID of admin:', 'wordpress-seo' ) . '</label>';
		echo '<input type="text" name="fb_admin_id" value="" maxlength="255"  />';
		echo '</div>';
		echo "<p class='submit'>";
		echo '<input type="hidden" name="fb_admin_nonce" value="' . wp_create_nonce( 'wpseo_fb_admin_nonce' ) . '" />';
		echo '<input type="submit" value="' . __( 'Add admin', 'wordpress-seo' ) . '" class="button-primary" onclick="javascript:wpseo_add_fb_admin();" />';
		echo '</p>';
		echo '</div>';
		echo '</div>';

		return $this;
	}

	/**
	 * Display the buttons to add an admin or add another admin from Facebook and display the admin that has been added already.
	 *
	 * @return $this
	 */
	private function manage_user_admin() {
		$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
		$nonce       = false;
		$style       = 'style="display:none"';

		if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			$nonce       = $this->get_delete_nonce();
			$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
			$style       = '';
		}

		echo "<div id='connected_fb_admins' {$style}>";
		echo '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
		echo '<ul id="user_admin">';
			$this->show_user_admins( $nonce );
		echo '</ul>';
		echo '</div>';

		unset( $nonce );

		$this->add_button(
			'#TB_inline?width=600&height=300&inlineId=add_facebook_admin',
			$button_text,
			'thickbox',
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
			echo $this->get_admin_link( $admin_id, $admin, $nonce );
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
		$this->buttons[] = '<a id="' .esc_attr( $button_id ). '" class="button' . ' ' . esc_attr( $button_class ) . '" href="' . esc_url( $button_url ) . '">' . esc_html( $button_value ) . '</a>';
	}

	/**
	 * Showing the buttons
	 */
	private function show_buttons() {
		if ( $this->get_clearall() ) {
			$this->add_button(
				esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'fbclearall' ), 'fbclearall' => 'true' ), admin_url( $this->admin_url . '#top#facebook' ) ) ),
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

	/**
	 * Creates nonce for removal link
	 *
	 * @return mixed
	 */
	private function get_delete_nonce() {
		return wp_create_nonce( 'delfbadmin' );
	}

}
