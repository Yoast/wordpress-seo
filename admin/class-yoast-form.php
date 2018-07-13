<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Admin form class.
 *
 * @since 2.0
 */
class Yoast_Form {

	/**
	 * @var object    Instance of this class
	 * @since 2.0
	 */
	public static $instance;

	/**
	 * @var string
	 * @since 2.0
	 */
	public $option_name;

	/**
	 * @var array
	 * @since 2.0
	 */
	public $options;

	/**
	 * Get the singleton instance of this class
	 *
	 * @since 2.0
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
	 * @since 2.0
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
		<div class="wrap yoast wpseo-admin-page <?php echo esc_attr( 'page-' . $option ); ?>">
		<?php
		/**
		 * Display the updated/error messages
		 * Only needed as our settings page is not under options, otherwise it will automatically be included
		 *
		 * @see settings_errors()
		 */
		require_once ABSPATH . 'wp-admin/options-head.php';
		?>
		<h1 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<div class="wpseo_content_wrapper">
		<div class="wpseo_content_cell" id="wpseo_content_top">
		<?php
		if ( $form === true ) {
			$enctype = ( $contains_files ) ? ' enctype="multipart/form-data"' : '';

			$network_admin = new Yoast_Network_Admin();
			if ( $network_admin->meets_requirements() ) {
				$action_url       = network_admin_url( 'settings.php' );
				$hidden_fields_cb = array( $network_admin, 'settings_fields' );
			}
			else {
				$action_url       = admin_url( 'options.php' );
				$hidden_fields_cb = 'settings_fields';
			}

			echo '<form action="' . esc_url( $action_url ) . '" method="post" id="wpseo-conf"' . $enctype . ' accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
			call_user_func( $hidden_fields_cb, $option_long_name );
		}
		$this->set_option( $option );
	}

	/**
	 * Set the option used in output for form elements
	 *
	 * @since 2.0
	 *
	 * @param string $option_name Option key.
	 */
	public function set_option( $option_name ) {
		$this->option_name = $option_name;
		$this->options     = $this->get_option();
	}

	/**
	 * Sets a value in the options.
	 *
	 * @since 5.4
	 *
	 * @param string $key       The key of the option to set.
	 * @param mixed  $value     The value to set the option to.
	 * @param bool   $overwrite Whether to overwrite existing options. Default is false.
	 */
	public function set_options_value( $key, $value, $overwrite = false ) {
		if ( $overwrite || ! array_key_exists( $key, $this->options ) ) {
			$this->options[ $key ] = $value;
		}
	}

	/**
	 * Retrieve options based on whether we're on multisite or not.
	 *
	 * @since 1.2.4
	 * @since 2.0   Moved to this class.
	 *
	 * @return array
	 */
	public function get_option() {
		if ( is_network_admin() ) {
			return get_site_option( $this->option_name );
		}

		return get_option( $this->option_name );
	}

	/**
	 * Generates the footer for admin pages
	 *
	 * @since 2.0
	 *
	 * @param bool $submit       Whether or not a submit button and form end tag should be shown.
	 * @param bool $show_sidebar Whether or not to show the banner sidebar - used by premium plugins to disable it.
	 */
	public function admin_footer( $submit = true, $show_sidebar = true ) {
		if ( $submit ) {
			submit_button( __( 'Save changes', 'wordpress-seo' ) );

			echo '
			</form>';
		}

		/**
		 * Apply general admin_footer hooks
		 */
		do_action( 'wpseo_admin_footer', $this );

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

		do_action( 'wpseo_admin_below_content', $this );

		echo '
			</div><!-- end of wrap -->';
	}

	/**
	 * Generates the sidebar for admin pages.
	 *
	 * @since 2.0
	 */
	public function admin_sidebar() {

		// No banners in Premium.
		if ( class_exists( 'WPSEO_Product_Premium' ) ) {
			$product_premium   = new WPSEO_Product_Premium();
			$extension_manager = new WPSEO_Extension_Manager();

			if ( $extension_manager->is_activated( $product_premium->get_slug() ) ) {
				return;
			}
		}

		require_once 'views/sidebar.php';
	}

	/**
	 * Output a label element
	 *
	 * @since 2.0
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
		echo "<label class='" . esc_attr( $attr['class'] ) . "' for='" . esc_attr( $attr['for'] ) . "'>$text";
		if ( $attr['close'] ) {
			echo '</label>';
		}
	}

	/**
	 * Output a legend element.
	 *
	 * @since 3.4
	 *
	 * @param string $text Legend text string.
	 * @param array  $attr HTML attributes set.
	 */
	public function legend( $text, $attr ) {
		$attr = wp_parse_args( $attr, array(
				'id'    => '',
				'class' => '',
			)
		);

		$id = ( '' === $attr['id'] ) ? '' : ' id="' . esc_attr( $attr['id'] ) . '"';
		echo '<legend class="yoast-form-legend ' . esc_attr( $attr['class'] ) . '"' . $id . '>' . $text . '</legend>';
	}

	/**
	 * Create a Checkbox input field.
	 *
	 * @since 2.0
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
	 * Create a light switch input field using a single checkbox.
	 *
	 * @since 3.1
	 *
	 * @param string  $var        The variable within the option to create the checkbox for.
	 * @param string  $label      The label element text for the checkbox.
	 * @param array   $buttons    Array of two visual labels for the buttons (defaults Disabled/Enabled).
	 * @param boolean $reverse    Reverse order of buttons (default true).
	 * @param string  $help       Inline Help that will be printed out before the visible toggles text.
	 */
	public function light_switch( $var, $label, $buttons = array(), $reverse = true, $help = '' ) {

		if ( ! isset( $this->options[ $var ] ) ) {
			$this->options[ $var ] = false;
		}

		if ( $this->options[ $var ] === true ) {
			$this->options[ $var ] = 'on';
		}

		$class           = 'switch-light switch-candy switch-yoast-seo';
		$aria_labelledby = esc_attr( $var ) . '-label';

		if ( $reverse ) {
			$class .= ' switch-yoast-seo-reverse';
		}

		if ( empty( $buttons ) ) {
			$buttons = array( __( 'Disabled', 'wordpress-seo' ), __( 'Enabled', 'wordpress-seo' ) );
		}

		list( $off_button, $on_button ) = $buttons;

		$help_class               = '';
		$screen_reader_text_class = '';

		$help_class = ! empty( $help ) ? ' switch-container__has-help' : '';

		echo "<div class='switch-container$help_class'>",
		"<span class='switch-light-visual-label'>{$label}</span>" . $help,
		'<label class="', $class, '"><b class="switch-yoast-seo-jaws-a11y">&nbsp;</b>',
		'<input type="checkbox" aria-labelledby="', $aria_labelledby, '" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', checked( $this->options[ $var ], 'on', false ), '/>',
		"<b class='label-text screen-reader-text' id='{$aria_labelledby}'>{$label}</b>",
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
	 * @since 2.0
	 * @since 2.1 Introduced the `$attr` parameter.
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

		$this->label(
			$label . ':',
			array(
				'for'   => $var,
				'class' => 'textinput',
			)
		);
		echo '<input class="textinput ' . esc_attr( $attr['class'] ) . ' " placeholder="' . esc_attr( $attr['placeholder'] ) . '" type="text" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="', esc_attr( $val ), '"/>', '<br class="clear" />';
	}

	/**
	 * Create a textarea.
	 *
	 * @since 2.0
	 *
	 * @param string       $var   The variable within the option to create the textarea for.
	 * @param string       $label The label to show for the variable.
	 * @param string|array $attr  The CSS class or an array of attributes to assign to the textarea.
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

		$this->label(
			$label . ':',
			array(
				'for'   => $var,
				'class' => 'textinput',
			)
		);
		echo '<textarea cols="' . esc_attr( $attr['cols'] ) . '" rows="' . esc_attr( $attr['rows'] ) . '" class="textinput ' . esc_attr( $attr['class'] ) . '" id="' . esc_attr( $var ) . '" name="' . esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']">' . esc_textarea( $val ) . '</textarea><br class="clear" />';
	}

	/**
	 * Create a hidden input field.
	 *
	 * @since 2.0
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
	 * @since 2.0
	 *
	 * @param string $field_name     The variable within the option to create the select for.
	 * @param string $label          The label to show for the variable.
	 * @param array  $select_options The select options to choose from.
	 */
	public function select( $field_name, $label, array $select_options ) {

		if ( empty( $select_options ) ) {
			return;
		}

		$this->label(
			$label . ':',
			array(
				'for'   => $field_name,
				'class' => 'select',
			)
		);

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
	 * @since 2.0
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
		$this->label(
			$label . ':',
			array(
				'for'   => $var,
				'class' => 'select',
			)
		);
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
	 * @since 2.0
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

		$this->label(
			$label . ':',
			array(
				'for'   => 'wpseo_' . $var,
				'class' => 'select',
			)
		);
		echo '<input class="textinput" id="wpseo_', $var_esc, '" type="text" size="36" name="', esc_attr( $this->option_name ), '[', $var_esc, ']" value="', esc_attr( $val ), '" />';
		echo '<input id="wpseo_', $var_esc, '_button" class="wpseo_image_upload_button button" type="button" value="', esc_attr__( 'Upload Image', 'wordpress-seo' ), '" />';
		echo '<br class="clear"/>';
	}

	/**
	 * Create a Radio input field.
	 *
	 * @since 2.0
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
			$this->label(
				$value,
				array(
					'for'   => $var_esc . '-' . $key_esc,
					'class' => 'radio',
				)
			);
		}
		echo '</fieldset>';
	}


	/**
	 * Create a toggle switch input field using two radio buttons.
	 *
	 * @since 3.1
	 *
	 * @param string $var    The variable within the option to create the radio buttons for.
	 * @param array  $values Associative array of on/off keys and their values to be used as
	 *                       the label elements text for the radio buttons. Optionally, each
	 *                       value can be an array of visible label text and screen reader text.
	 * @param string $label  The visual label for the radio buttons group, used as the fieldset legend.
	 * @param string $help   Inline Help that will be printed out before the visible toggles text.
	 */
	public function toggle_switch( $var, $values, $label, $help = '' ) {
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

		$help_class = ! empty( $help ) ? ' switch-container__has-help' : '';

		$var_esc = esc_attr( $var );

		printf( '<div class="%s">', esc_attr( 'switch-container' . $help_class ) );
		echo '<fieldset id="', $var_esc, '" class="fieldset-switch-toggle"><legend>', $label, '</legend>', $help,
		'<div class="switch-toggle switch-candy switch-yoast-seo">';

		foreach ( $values as $key => $value ) {
			$screen_reader_text      = '';
			$screen_reader_text_html = '';

			if ( is_array( $value ) ) {
				$screen_reader_text      = $value['screen_reader_text'];
				$screen_reader_text_html = '<span class="screen-reader-text"> ' . esc_html( $screen_reader_text ) . '</span>';
				$value                   = $value['text'];
			}

			$key_esc = esc_attr( $key );
			$for     = $var_esc . '-' . $key_esc;
			echo '<input type="radio" id="' . $for . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $this->options[ $var ], $key_esc, false ) . ' />',
			'<label for="', $for, '">', esc_html( $value ), $screen_reader_text_html,'</label>';
		}

		echo '<a></a></div></fieldset><div class="clear"></div></div>' . "\n\n";
	}

	/**
	 * Creates a toggle switch to define whether an indexable should be indexed or not.
	 *
	 * @param string $var    The variable within the option to create the radio buttons for.
	 * @param string $label  The visual label for the radio buttons group, used as the fieldset legend.
	 * @param string $help   Inline Help that will be printed out before the visible toggles text.
	 *
	 * @return void
	 */
	public function index_switch( $var, $label, $help = '' ) {
		$index_switch_values = array(
			'off' => __( 'Yes', 'wordpress-seo' ),
			'on'  => __( 'No', 'wordpress-seo' ),
		);

		$this->toggle_switch(
			$var,
			$index_switch_values,
			sprintf(
				/* translators: %s expands to an indexable object's name, like a post type or taxonomy */
				esc_html__( 'Show %s in search results?', 'wordpress-seo' ),
				'<strong>' . esc_html( $label ) . '</strong>'
			),
			$help
		);
	}

	/**
	 * Creates a toggle switch to show hide certain options.
	 *
	 * @param string $var           The variable within the option to create the radio buttons for.
	 * @param string $label         The visual label for the radio buttons group, used as the fieldset legend.
	 * @param bool   $inverse_keys  Whether or not the option keys need to be inverted to support older functions.
	 * @param string $help          Inline Help that will be printed out before the visible toggles text.
	 *
	 * @return void
	 */
	public function show_hide_switch( $var, $label, $inverse_keys = false, $help = '' ) {
		$on_key  = ( $inverse_keys ) ? 'off' : 'on';
		$off_key = ( $inverse_keys ) ? 'on' : 'off';

		$show_hide_switch = array(
			$on_key  => __( 'Show', 'wordpress-seo' ),
			$off_key => __( 'Hide', 'wordpress-seo' ),
		);

		$this->toggle_switch( $var, $show_hide_switch, $label, $help );
	}
}
