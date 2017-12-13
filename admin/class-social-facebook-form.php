<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

/**
 * This will display the HTML for the facebook insights part
 */
class Yoast_Social_Facebook_Form {

	/**
	 * @var    array    - The options for social
	 */
	private $options;

	/**
	 * @var array    - The repository for the buttons that will be shown
	 */
	private $buttons = array();

	/**
	 * @var string    - The URL to link to
	 */
	private $admin_url = 'admin.php?page=wpseo_social';

	/**
	 * Setting the options and call the methods to display everything
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
	 * @param string      $admin_id Facebook admin ID string.
	 * @param array       $admin    Admin data array.
	 * @param string|bool $nonce    Optional nonce string.
	 *
	 * @return string
	 */
	public function get_admin_link( $admin_id, $admin, $nonce = false ) {
		if ( $nonce === false ) {
			$nonce = $this->get_delete_nonce();
		}

		$return  = '<li><a target="_blank" href="' . esc_url( $admin['link'] ) . '">' . esc_html( $admin['name'] ) . '</a>';
		$return .= ' - <strong><a href="' . $this->admin_delete_link( $admin_id, $nonce ) . '">X</a></strong></li>';

		return $return;
	}

	/**
	 * SHow the top of the social insights part of the page
	 *
	 * @return $this
	 */
	private function form_head() {
		echo '<h2>' . esc_html__( 'Facebook Insights and Admins', 'wordpress-seo' ) . '</h2>';
		echo '<p>', sprintf(
			/* translators: %1$s and %2$s expand to a link to Facebook Insights */
			esc_html__( 'To be able to access %1$sFacebook Insights%2$s for your site, you need to specify a Facebook Admin. This can be a user. If you have an app for your site, you could use that as well.', 'wordpress-seo' ),
			'<a target="_blank" href="https://www.facebook.com/insights">',
			'</a>'
		);
		echo ' ';
		printf(
			/* translators: %1$s and %2$s expand to a link to the Yoast Knowledge Base */
			esc_html__( 'More info can be found %1$son our knowledge base%2$s.', 'wordpress-seo' ),
			'<a target="_blank" href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/facebook-insights' ) ) . '">',
			'</a>'
		);
		echo '</p>';

		return $this;
	}

	/**
	 * Show the form inside the thickbox
	 */
	private function form_thickbox() {
		// Adding the thickbox.
		add_thickbox();

		echo '<div id="add_facebook_admin" class="hidden">';
		echo "<div class='form-wrap wpseo_content_wrapper wpseo-add-fb-admin-form-wrap'>";
		echo '<p>';
		printf(
			/* translators: %1$s and %2$s expand to a link to Facebook Insights */
			esc_html__( 'To be able to access %1$sFacebook Insights%2$s, you need to add a user here. The name is used for reference only, the ID is used for verification.', 'wordpress-seo' ),
			'<a target="_blank" href="https://www.facebook.com/insights">',
			'</a>'
		);
		echo '</p>';
		echo '<p>';
		printf(
			/* translators: %1$s and %2$s expand to a link to the Yoast Knowledge Base */
			esc_html__( 'If you don\'t know where to find the needed ID, see %1$sthis knowledge base article%2$s.', 'wordpress-seo' ),
			'<a target="_blank" href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/facebook-insights' ) ) . '">',
			'</a>'
		);
		echo '</p>';
		echo '<div class="form-field form-required">';
		echo '<label for="fb_admin_name">' . esc_html__( 'Admin\'s name:', 'wordpress-seo' ) . '</label>';
		echo '<input type="text" id="fb_admin_name" name="fb_admin_name" value="" maxlength="255" />';
		echo '</div>';
		echo '<div class="form-field form-required">';
		echo '<label for="fb_admin_id">' . esc_html__( 'Admin\'s Facebook user ID:', 'wordpress-seo' ) . '</label>';
		echo '<input type="text" id="fb_admin_id" name="fb_admin_id" value="" maxlength="255"  />';
		echo '</div>';
		echo "<p class='submit'>";
		echo '<input type="hidden" name="fb_admin_nonce" value="' . esc_attr( wp_create_nonce( 'wpseo_fb_admin_nonce' ) ) . '" />';
		echo '<input type="submit" value="' . esc_attr__( 'Add Facebook admin', 'wordpress-seo' ) . '" class="button button-primary" onclick="javascript:wpseo_add_fb_admin();" />';
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
		$button_text = __( 'Add Facebook admin', 'wordpress-seo' );
		$nonce       = false;
		$class_attr  = ' class="hidden"';

		if ( is_array( $this->options['fb_admins'] ) && $this->options['fb_admins'] !== array() ) {
			$nonce       = $this->get_delete_nonce();
			$button_text = __( 'Add Another Facebook Admin', 'wordpress-seo' );
			$class_attr  = '';
		}

		echo "<div id='connected_fb_admins'{$class_attr}>";
		echo '<p>' . esc_html__( 'Currently connected Facebook admins:', 'wordpress-seo' ) . '</p>';
		echo '<ul id="user_admin">';
		$this->show_user_admins( $nonce );
		echo '</ul>';
		echo '</div>';

		unset( $nonce );

		$this->add_button(
			array(
				'url'   => '#TB_inline?width=600&height=350&inlineId=add_facebook_admin',
				'value' => $button_text,
				'class' => 'thickbox',
				'title' => $button_text,
			)
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
	 * @param string $nonce Nonce string.
	 */
	private function show_user_admins( $nonce ) {
		foreach ( $this->options['fb_admins'] as $admin_id => $admin ) {
			echo $this->get_admin_link( $admin_id, $admin, $nonce );
		}
	}

	/**
	 * Parsing the link that directs to the admin removal
	 *
	 * @param string $admin_id Facebook admin ID.
	 * @param string $nonce    Nonce string.
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
	 * @param array $args Arguments data array.
	 */
	private function add_button( $args ) {
		$args = wp_parse_args(
			$args,
			array(
				'url'   => '',
				'value' => '',
				'class' => '',
				'id'    => '',
				'title' => '',

			)
		);

		$this->buttons[] = '<a title="' . esc_attr( $args['title'] ) . '" id="' . esc_attr( $args['id'] ) . '" class="button ' . esc_attr( $args['class'] ) . '" href="' . esc_url( $args['url'] ) . '">' . esc_html( $args['value'] ) . '</a>';
	}

	/**
	 * Showing the buttons
	 */
	private function show_buttons() {
		if ( $this->get_clearall() ) {
			$this->add_button(
				array(
					'url'   => add_query_arg( array(
						'nonce'      => wp_create_nonce( 'fbclearall' ),
						'fbclearall' => 'true',
					), admin_url( $this->admin_url . '#top#facebook' ) ),
					'value' => __( 'Clear all Facebook Data', 'wordpress-seo' ),
				)
			);
		}

		if ( is_array( $this->buttons ) && $this->buttons !== array() ) {
			echo '<p class="fb-buttons">' . implode( '', $this->buttons ) . '</p>';
		}

		return $this;
	}

	/**
	 * Check if the clear button should be displayed. This is based on the set options.
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
