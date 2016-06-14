<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Admin form class.
 */
class Yoast_Form {

	/**
	 * @var object    Instance of this class
	 */
	public static $instance;

	/**
	 * @var string
	 */
	public $option_name;

	/**
	 * @var array
	 */
	public $options;

	/**
	 * Get the singleton instance of this class
	 *
	 * @return Yoast_Form
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Generates the header for admin pages
	 *
	 * @param bool   $form             Whether or not the form start tag should be included.
	 * @param string $option           The short name of the option to use for the current page.
	 * @param bool   $contains_files   Whether the form should allow for file uploads.
	 * @param bool   $option_long_name Group name of the option.
	 */
	public function admin_header( $form = true, $option = 'wpseo', $contains_files = false, $option_long_name = false ) {
		if ( ! $option_long_name ) {
			$option_long_name = WPSEO_Options::get_group_name( $option );
		}
		?>
		<div class="wrap wpseo-admin-page page-<?php echo $option; ?>">
		<?php
		/**
		 * Display the updated/error messages
		 * Only needed as our settings page is not under options, otherwise it will automatically be included
		 *
		 * @see settings_errors()
		 */
		require_once( ABSPATH . 'wp-admin/options-head.php' );
		?>
		<h1 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<div class="wpseo_content_wrapper">
		<div class="wpseo_content_cell" id="wpseo_content_top">
		<?php
		if ( $form === true ) {
			$enctype = ( $contains_files ) ? ' enctype="multipart/form-data"' : '';
			echo '<form action="' . esc_url( admin_url( 'options.php' ) ) . '" method="post" id="wpseo-conf"' . $enctype . ' accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
			settings_fields( $option_long_name );
		}
		$this->set_option( $option );
	}

	/**
	 * Set the option used in output for form elements
	 *
	 * @param string $option_name Option key.
	 */
	public function set_option( $option_name ) {
		$this->option_name = $option_name;
		$this->options     = $this->get_option();
	}

	/**
	 * Retrieve options based on whether we're on multisite or not.
	 *
	 * @since 1.2.4
	 *
	 * @return array
	 */
	private function get_option() {
		if ( is_network_admin() ) {
			return get_site_option( $this->option_name );
		}

		return get_option( $this->option_name );
	}

	/**
	 * Generates the footer for admin pages
	 *
	 * @param bool $submit       Whether or not a submit button and form end tag should be shown.
	 * @param bool $show_sidebar Whether or not to show the banner sidebar - used by premium plugins to disable it.
	 */
	public function admin_footer( $submit = true, $show_sidebar = true ) {
		if ( $submit ) {
			submit_button();

			echo '
			</form>';
		}

		/**
		 * Apply general admin_footer hooks
		 */
		do_action( 'wpseo_admin_footer' );

		/**
		 * Run possibly set actions to add for example an i18n box
		 */
		do_action( 'wpseo_admin_promo_footer' );

		echo '
			</div><!-- end of div wpseo_content_top -->';

		if ( $show_sidebar ) {
			$this->admin_sidebar();
		}

		echo '</div><!-- end of div wpseo_content_wrapper -->';


		if ( ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) ) {
			$xdebug = ( extension_loaded( 'xdebug' ) ? true : false );
			echo '
			<div id="poststuff">
			<div id="wpseo-debug-info" class="postbox">

				<h3 class="hndle"><span>' . __( 'Debug Information', 'wordpress-seo' ) . '</span></h3>
				<div class="inside">
					<h4>' . esc_html( __( 'Current option:', 'wordpress-seo' ) ) . ' <span class="wpseo-debug">' . esc_html( $this->option_name ) . '</span></h4>
					' . ( ( $xdebug ) ? '' : '<pre>' );
			var_dump( $this->get_option() );
			echo '
					' . ( ( $xdebug ) ? '' : '</pre>' ) . '
				</div>
			</div>
			</div>';
		}

		echo '
			</div><!-- end of wrap -->';
	}

	/**
	 * Generates the sidebar for admin pages.
	 */
	public function admin_sidebar() {

		// No banners in Premium.
		if ( class_exists( 'WPSEO_Product_Premium' ) ) {
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );
			if ( $license_manager->license_is_valid() ) {
				return;
			}
		}

		$service_banners = array(
			array(
				'url' => 'https://yoast.com/hire-us/website-review/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=website-review-banner',
				'img' => 'banner-website-review.png',
				'alt' => __( 'Order a Website Review and we will tell you what to improve to attract more visitors!', 'wordpress-seo' ),
			),
			array(
				'url' => 'https://yoast.com/academy/course/basic-seo-training/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=basic-seo-training-banner',
				'img' => 'banner-basic-seo-training.png',
				'alt' => __( 'Take the online Basic SEO Training course and learn the fundamentals of SEO!', 'wordpress-seo' ),
			),
			array(
				'url' => 'https://yoast.com/academy/course/yoast-seo-wordpress-training/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=yoast-seo-plugin-training-banner',
				'img' => 'banner-yoast-seo-for-wordpress-training.png',
				'alt' => __( 'Take the Yoast SEO for WordPress Training course and become a certified Yoast SEO for WordPress expert!', 'wordpress-seo' ),
			),
		);

		$plugin_banners = array(
			array(
				'url' => 'https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=premium-seo-banner',
				'img' => 'banner-premium-seo.png',
				'alt' => __( 'Buy the Yoast SEO Premium plugin now and get access to extra features and 24/7 support!', 'wordpress-seo' ),
			),
		);

		if ( ! class_exists( 'wpseo_Video_Sitemap' ) ) {
			$plugin_banners[] = array(
				'url' => 'https://yoast.com/wordpress/plugins/video-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=video-seo-banner',
				'img' => 'banner-video-seo.png',
				'alt' => __( 'Buy the Yoast Video SEO plugin now and optimize your videos for video search results and social media!', 'wordpress-seo' ),
			);
		}

		if ( class_exists( 'Woocommerce' ) && ! class_exists( 'Yoast_WooCommerce_SEO' ) ) {
			$plugin_banners[] = array(
				'url' => 'https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=woocommerce-seo-banner',
				'img' => 'banner-woocommerce-seo.png',
				'alt' => __( 'Buy the Yoast WooCommerce SEO plugin now and optimize your shop today to improve your product promotion!', 'wordpress-seo' ),
			);
		}

		if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
			$plugin_banners[] = array(
				'url' => 'https://yoast.com/wordpress/plugins/local-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=local-seo-banner',
				'img' => 'banner-local-seo.png',
				'alt' => __( 'Buy the Yoast Local SEO plugin now to improve your site&#8217;s Local SEO and ranking in Google Maps!', 'wordpress-seo' ),
			);
		}

		if ( ! class_exists( 'WPSEO_News' ) ) {
			$plugin_banners[] = array(
				'url' => 'https://yoast.com/wordpress/plugins/news-seo/#utm_source=wordpress-seo-config&utm_medium=banner&utm_campaign=news-seo-banner',
				'img' => 'banner-news-seo.png',
				'alt' => __( 'Buy the Yoast News SEO plugin now and start optimizing to get your site featured in Google News!', 'wordpress-seo' ),
			);
		}

		shuffle( $service_banners );
		shuffle( $plugin_banners );
		?>
		<div class="wpseo_content_cell" id="sidebar-container">
			<div id="sidebar">
		<?php

		$service_banner = $service_banners[0];

		echo '<a target="_blank" href="' . esc_url( $service_banner['url'] ) . '"><img width="261" height="190" src="' . plugins_url( 'images/' . $service_banner['img'], WPSEO_FILE ) . '" alt="' . esc_attr( $service_banner['alt'] ) . '"/></a><br/><br/>';

		$i = 0;
		foreach ( $plugin_banners as $banner ) {
			if ( $i == 2 ) {
				break;
			}
			echo '<a target="_blank" href="' . esc_url( $banner['url'] ) . '"><img width="261" height="152" src="' . plugins_url( 'images/' . $banner['img'], WPSEO_FILE ) . '" alt="' . esc_attr( $banner['alt'] ) . '"/></a><br/><br/>';
			$i ++;
		}
		?>
				<p class="wpseo-remove-ads">
				<strong><?php _e( 'Remove these ads?', 'wordpress-seo' ); ?></strong><br/>
				<a target="_blank" href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-config&amp;utm_medium=textlink&amp;utm_campaign=remove-ads-link"><?php
				 /* translators: %1$s expands to Yoast SEO Premium */
				printf( __( 'Upgrade to %1$s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></a>
			</p>
			</div>
		</div>
	<?php
	}

	/**
	 * Output a label element
	 *
	 * @param string $text Label text string.
	 * @param array  $attr HTML attributes set.
	 */
	public function label( $text, $attr ) {
		$attr = wp_parse_args( $attr, array(
				'class' => 'checkbox',
				'close' => true,
				'for'   => '',
			)
		);
		echo "<label class='" . $attr['class'] . "' for='" . esc_attr( $attr['for'] ) . "'>$text";
		if ( $attr['close'] ) {
			echo '</label>';
		}
	}

	/**
	 * Create a Checkbox input field.
	 *
	 * @param string $var        The variable within the option to create the checkbox for.
	 * @param string $label      The label to show for the variable.
	 * @param bool   $label_left Whether the label should be left (true) or right (false).
	 */
	public function checkbox( $var, $label, $label_left = false ) {
		if ( ! isset( $this->options[ $var ] ) ) {
			$this->options[ $var ] = false;
		}

		if ( $this->options[ $var ] === true ) {
			$this->options[ $var ] = 'on';
		}

		$class = '';
		if ( $label_left !== false ) {
			if ( ! empty( $label_left ) ) {
				$label_left .= ':';
			}
			$this->label( $label_left, array( 'for' => $var ) );
		}
		else {
			$class = 'double';
		}

		echo '<input class="checkbox ', esc_attr( $class ), '" type="checkbox" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', checked( $this->options[ $var ], 'on', false ), '/>';

		if ( ! empty( $label ) ) {
			$this->label( $label, array( 'for' => $var ) );
		}

		echo '<br class="clear" />';
	}

	/**
	 * Create a light switch input field.
	 *
	 * @param string  $var        The variable within the option to create the checkbox for.
	 * @param string  $label      The label to show for the variable.
	 * @param array   $buttons    Array of two labels for the buttons (defaults Off/On).
	 * @param boolean $reverse    Reverse order of buttons (default true).
	 */
	public function light_switch( $var, $label, $buttons = array(), $reverse = true ) {

		if ( ! isset( $this->options[ $var ] ) ) {
			$this->options[ $var ] = false;
		}

		if ( $this->options[ $var ] === true ) {
			$this->options[ $var ] = 'on';
		}

		$class = 'switch-light switch-candy switch-yoast-seo';
		$aria_labelledby = esc_attr( $var ) . '-label';

		if ( $reverse ) {
			$class .= ' switch-yoast-seo-reverse';
		}

		if ( empty( $buttons ) ) {
			$buttons = array( __( 'Disabled', 'wordpress-seo' ), __( 'Enabled', 'wordpress-seo' ) );
		}

		list( $off_button, $on_button ) = $buttons;

		echo '<div class="switch-container">',
		'<label class="', esc_attr( $class ), '"><b class="switch-yoast-seo-jaws-a11y">&nbsp;</b>',
		'<input type="checkbox" aria-labelledby="', $aria_labelledby, '" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', checked( $this->options[ $var ], 'on', false ), '/>',
		"<b class='label-text' id='{$aria_labelledby}'>{$label}</b>",
		'<span aria-hidden="true">
			<span>', esc_html( $off_button ) ,'</span>
			<span>', esc_html( $on_button ) ,'</span>
			<a></a>
		 </span>
		 </label><div class="clear"></div></div>';
	}

	/**
	 * Create a Text input field.
	 *
	 * @param string       $var   The variable within the option to create the text input field for.
	 * @param string       $label The label to show for the variable.
	 * @param array|string $attr  Extra class to add to the input field.
	 */
	public function textinput( $var, $label, $attr = array() ) {
		if ( ! is_array( $attr ) ) {
			$attr = array(
				'class' => $attr,
			);
		}
		$attr = wp_parse_args( $attr, array(
			'placeholder' => '',
			'class'       => '',
		) );
		$val  = ( isset( $this->options[ $var ] ) ) ? $this->options[ $var ] : '';

		$this->label( $label . ':', array( 'for' => $var ) );
		echo '<input class="textinput ' . esc_attr( $attr['class'] ) . ' " placeholder="' . esc_attr( $attr['placeholder'] ) . '" type="text" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="', esc_attr( $val ), '"/>', '<br class="clear" />';
	}

	/**
	 * Create a textarea.
	 *
	 * @param string $var   The variable within the option to create the textarea for.
	 * @param string $label The label to show for the variable.
	 * @param array  $attr  The CSS class to assign to the textarea.
	 */
	public function textarea( $var, $label, $attr = array() ) {
		if ( ! is_array( $attr ) ) {
			$attr = array(
				'class' => $attr,
			);
		}
		$attr = wp_parse_args( $attr, array(
			'cols'  => '',
			'rows'  => '',
			'class' => '',
		) );
		$val  = ( isset( $this->options[ $var ] ) ) ? $this->options[ $var ] : '';

		$this->label( $label . ':', array( 'for' => $var, 'class' => 'textinput' ) );
		echo '<textarea cols="' . esc_attr( $attr['cols'] ) . '" rows="' . esc_attr( $attr['rows'] ) . '" class="textinput ' . esc_attr( $attr['class'] ) . '" id="' . esc_attr( $var ) . '" name="' . esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']">' . esc_textarea( $val ) . '</textarea>' . '<br class="clear" />';
	}

	/**
	 * Create a hidden input field.
	 *
	 * @param string $var The variable within the option to create the hidden input for.
	 * @param string $id  The ID of the element.
	 */
	public function hidden( $var, $id = '' ) {
		$val = ( isset( $this->options[ $var ] ) ) ? $this->options[ $var ] : '';
		if ( is_bool( $val ) ) {
			$val = ( $val === true ) ? 'true' : 'false';
		}

		if ( '' === $id ) {
			$id = 'hidden_' . $var;
		}

		echo '<input type="hidden" id="' . esc_attr( $id ) . '" name="' . esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']" value="' . esc_attr( $val ) . '"/>';
	}

	/**
	 * Create a Select Box.
	 *
	 * @param string $field_name     The variable within the option to create the select for.
	 * @param string $label          The label to show for the variable.
	 * @param array  $select_options The select options to choose from.
	 */
	public function select( $field_name, $label, array $select_options ) {

		if ( empty( $select_options ) ) {
			return;
		}

		$this->label( $label . ':', array( 'for' => $field_name, 'class' => 'select' ) );

		$select_name   = esc_attr( $this->option_name ) . '[' . esc_attr( $field_name ) . ']';
		$active_option = ( isset( $this->options[ $field_name ] ) ) ? $this->options[ $field_name ] : '';

		$select = new Yoast_Input_Select( $field_name, $select_name, $select_options, $active_option );
		$select->add_attribute( 'class', 'select' );
		$select->output_html();

		echo '<br class="clear"/>';
	}

	/**
	 * Create a File upload field.
	 *
	 * @param string $var   The variable within the option to create the file upload field for.
	 * @param string $label The label to show for the variable.
	 */
	public function file_upload( $var, $label ) {
		$val = '';
		if ( isset( $this->options[ $var ] ) && is_array( $this->options[ $var ] ) ) {
			$val = $this->options[ $var ]['url'];
		}

		$var_esc = esc_attr( $var );
		$this->label( $label . ':', array( 'for' => $var, 'class' => 'select' ) );
		echo '<input type="file" value="' . esc_attr( $val ) . '" class="textinput" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" id="' . $var_esc . '"/>';

		// Need to save separate array items in hidden inputs, because empty file inputs type will be deleted by settings API.
		if ( ! empty( $this->options[ $var ] ) ) {
			$this->hidden( 'file', $this->option_name . '_file' );
			$this->hidden( 'url', $this->option_name . '_url' );
			$this->hidden( 'type', $this->option_name . '_type' );
		}
		echo '<br class="clear"/>';
	}

	/**
	 * Media input
	 *
	 * @param string $var   Option name.
	 * @param string $label Label message.
	 */
	public function media_input( $var, $label ) {
		$val = '';
		if ( isset( $this->options[ $var ] ) ) {
			$val = $this->options[ $var ];
		}

		$var_esc = esc_attr( $var );

		$this->label( $label . ':', array( 'for' => 'wpseo_' . $var, 'class' => 'select' ) );
		echo '<input class="textinput" id="wpseo_', $var_esc, '" type="text" size="36" name="', esc_attr( $this->option_name ), '[', $var_esc, ']" value="', esc_attr( $val ), '" />';
		echo '<input id="wpseo_', $var_esc, '_button" class="wpseo_image_upload_button button" type="button" value="', __( 'Upload Image', 'wordpress-seo' ), '" />';
		echo '<br class="clear"/>';
	}

	/**
	 * Create a Radio input field.
	 *
	 * @param string $var         The variable within the option to create the radio button for.
	 * @param array  $values      The radio options to choose from.
	 * @param string $legend      Optional. The legend to show for the field set, if any.
	 * @param array  $legend_attr Optional. The attributes for the legend, if any.
	 */
	public function radio( $var, $values, $legend = '', $legend_attr = array() ) {
		if ( ! is_array( $values ) || $values === array() ) {
			return;
		}
		if ( ! isset( $this->options[ $var ] ) ) {
			$this->options[ $var ] = false;
		}

		$var_esc = esc_attr( $var );

		echo '<fieldset class="yoast-form-fieldset wpseo_radio_block" id="' . $var_esc . '">';

		if ( is_string( $legend ) && '' !== $legend ) {

			$legend_attr = wp_parse_args( $legend_attr, array(
				'id'    => '',
				'class' => 'radiogroup',
			) );

			$this->legend( $legend, $legend_attr );
		}

		foreach ( $values as $key => $value ) {
			$key_esc = esc_attr( $key );
			echo '<input type="radio" class="radio" id="' . $var_esc . '-' . $key_esc . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $this->options[ $var ], $key_esc, false ) . ' />';
			$this->label( $value, array( 'for' => $var_esc . '-' . $key_esc, 'class' => 'radio' ) );
		}
		echo '</fieldset>';
	}


	/**
	 * Create a toggle switch input field.
	 *
	 * @param string $var    The variable within the option to create the file upload field for.
	 * @param array  $values The radio options to choose from.
	 * @param string $label  The label to show for the variable.
	 */
	public function toggle_switch( $var, $values, $label ) {
		if ( ! is_array( $values ) || $values === array() ) {
			return;
		}
		if ( ! isset( $this->options[ $var ] ) ) {
			$this->options[ $var ] = false;
		}
		if ( $this->options[ $var ] === true ) {
			$this->options[ $var ] = 'on';
		}
		if ( $this->options[ $var ] === false ) {
			$this->options[ $var ] = 'off';
		}

		$var_esc = esc_attr( $var );

		echo '<div class="switch-container">';
		echo '<fieldset id="', $var_esc, '" class="fieldset-switch-toggle"><legend>', $label, '</legend>
		<div class="switch-toggle switch-candy switch-yoast-seo">';

		foreach ( $values as $key => $value ) {
			$key_esc = esc_attr( $key );
			$for     = $var_esc . '-' . $key_esc;
			echo '<input type="radio" id="' . $for . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $this->options[ $var ], $key_esc, false ) . ' />',
			'<label for="', $for, '">', $value, '</label>';
		}

		echo '<a></a></div></fieldset><div class="clear"></div></div>' . "\n\n";
	}
}
