<?php

class Yoast_Social_Facebook {

	private $options;

	/**
	 * Setting the options and define the listener to fetch $_GET values
	 *
	 */
	public function __construct( ) {
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
	 * 
	 */
	private function get_listener() {
		if ( $delfbadmin = filter_input( INPUT_GET, 'delfbadmin' ) ) {
			$this->delete_admin( $delfbadmin );
		}
		elseif ( filter_input( INPUT_GET, 'fbclearall' ) ) {
			$this->clear_all( );
		}
		elseif ( $key = filter_input( INPUT_GET, 'key' ) ) {
			$this->handle_key( $key );
		}
	}

	private function delete_admin( $delfbadmin ) {
		$this->verify_nonce( 'delfbadmin' );

		$id = sanitize_text_field( $delfbadmin );
		if ( isset( $this->options['fb_admins'][ $id ] ) ) {
			$fbadmin = $this->options['fb_admins'][ $id ]['name'];
			unset( $this->options['fb_admins'][ $id ] );

			$this->save_options();
			$this->success_notice( sprintf( __( 'Successfully removed admin %s', 'wordpress-seo' ), $fbadmin ) );

			unset( $fbadmin );
		}

		unset( $id );

		// Clean up the referrer url for later use
		if ( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) {
			$this->cleanup_referrer_url( 'nonce', 'delfbadmin' );
		}
	}

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

	private function handle_key( $key_value ) {
		if ( $key_value === $this->options['fbconnectkey'] && $user_id = filter_input( INPUT_GET, 'userid', FILTER_CALLBACK, array( 'options' => 'sanitize_text_field' ) ) ) {
			if ( ! isset( $this->options['fb_admins'][$user_id] ) ) {
				$this->options['fb_admins'][$user_id]['name'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'userrealname' ) ) );
				$this->options['fb_admins'][$user_id]['link'] = sanitize_text_field( urldecode( filter_input( INPUT_GET, 'link' ) ) );

				$this->save_options();
				$this->success_notice(
					sprintf( __( 'Successfully added %s as a Facebook Admin!', 'wordpress-seo' ), '<a href="' . esc_url( $this->options['fb_admins'][$user_id]['link'] ) . '">' . esc_html( $this->options['fb_admins'][$user_id]['name'] ) . '</a>' )
				);
			} else {
				add_settings_error( 'yoast_wpseo_social_options', 'error', sprintf( __( '%s already exists as a Facebook Admin.', 'wordpress-seo' ), '<a href="' . esc_url( $this->options['fb_admins'][$user_id]['link'] ) . '">' . esc_html( $this->options['fb_admins'][$user_id]['name'] ) . '</a>' ), 'error' );
			}

			unset( $user_id );
		}

		// Clean up the referrer url for later use
		if ( filter_input( INPUT_SERVER, 'REQUEST_URI' ) ) {
			$this->cleanup_referrer_url( 'key', 'userid', 'userrealname', 'link' );
		}
	}

	private function cleanup_referrer_url( ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg(
			func_get_args(),
			filter_input(
				INPUT_SERVER, 'REQUEST_URI', FILTER_CALLBACK, array( 'options' => 'sanitize_text_field' )
			)
		);
	}

	private function success_notice( $notice_text ) {
		add_settings_error( 'yoast_wpseo_social_options', 'success', $notice_text, 'updated' );
	}

	private function verify_nonce( $nonce_name ) {
		if ( wp_verify_nonce( $_GET['nonce'], $nonce_name ) != 1 ) {
			die( "I don't think that's really nice of you!." );
		}
	}

	private function save_options() {
		update_option( 'wpseo_social', $this->options );
	}


}

function andy_test() {
	echo 'andy_test';
	exit;
}

class Yoast_Social_Facebook_Form {

	private $options;

	/**
	 * @var string
	 */
	private $output = '';

	private $buttons = array();

	private $app_button_text;


	public function __construct( ) {
		$this->options = get_option( 'wpseo_social' );

		$this
			->form_head()
			->app_admin()
			->user_admin()
			->show_buttons();
	}

	public function Output() {
		return $this->output;
	}

	/**
	 *
	 * @return $this
	 */
	private function form_head() {
		$this->output  = '<p><strong>' . esc_html__( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</strong><br />';
		$this->output .= sprintf(
			esc_html__ (
				'To be able to access your %sFacebook Insights%s for your site, you need to specify a Facebook Admin. This can be a user, but if you have an app for your site, you could use that. For most people a user will be "good enough" though.', 'wordpress-seo'
			),
			'<a href="https://www.facebook.com/insights">',
			'</a>'
		);
		$this->output .= '</p>';

		return $this;
	}

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

	private function user_admin() {

		if ( $this->options['fbadminapp'] == 0 ) {
			$button_text = __( 'Add Facebook Admin', 'wordpress-seo' );
			$primary     = true;
			if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
				$nonce = wp_create_nonce( 'delfbadmin' );

				$this->output .= '<p>' . __( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
				$this->output .= '<ul>';

				foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
					$admin_id = esc_attr( $admin_id );
					$this->output .= '<li><a href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a>';
					$this->output .= ' - <strong><a href="' . $this->user_admin_link( $admin_id, $nonce ) . '">X</a></strong></li>';
				}
				unset( $admin_id, $admin, $nonce );

				$this->output .= '</ul>';

				$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
				$primary     = false;
			}

			$this->add_button(
				'https://theme.dev/fb-connect/?key=' . urlencode( $this->options['fbconnectkey'] ) . '&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' ) ),
				$button_text,
				( ( $primary ) ? '-primary' : '' )
			);
		}

		return $this;
	}

	private function user_admin_link( $admin_id, $nonce ) {
		return esc_url(
			add_query_arg(
				array(
					'delfbadmin' => $admin_id,
					'nonce'      => $nonce,
				),
				admin_url( 'admin.php?page=wpseo_social' )
			)
		);
	}


	private function add_button( $button_url, $button_value, $button_class = '' ) {
		$this->buttons[] = '<a class="button' . esc_attr( $button_class ) . '" href="' . esc_url( $button_url ) . '">' . esc_html( $button_value ) . '</a>';
	}

	private function show_buttons() {
		$this->add_button(
			'https://theme.dev/fb-connect/?key=' . urlencode( $this->options['fbconnectkey'] ) . '&type=app&redirect=' . urlencode( admin_url( 'admin.php?page=wpseo_social' )),
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