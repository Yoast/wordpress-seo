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
	 * Instance of this class
	 *
	 * @var object
	 * @since 2.0
	 */
	public static $instance;

	/**
	 * The short name of the option to use for the current page.
	 *
	 * @var string
	 * @since 2.0
	 */
	public $option_name;

	/**
	 * Option instance.
	 *
	 * @since 8.4
	 * @var WPSEO_Option|null
	 */
	protected $option_instance = null;

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return Yoast_Form
	 * @since 2.0
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Generates the header for admin pages.
	 *
	 * @param bool   $form             Whether or not the form start tag should be included.
	 * @param string $option           The short name of the option to use for the current page.
	 * @param bool   $contains_files   Whether the form should allow for file uploads.
	 * @param bool   $option_long_name Group name of the option.
	 *
	 * @since 2.0
	 */
	public function admin_header( $form = true, $option = 'wpseo', $contains_files = false, $option_long_name = false ) {
		if ( ! $option_long_name ) {
			$option_long_name = WPSEO_Options::get_group_name( $option );
		}
		?>
	<div class="wrap yoast wpseo-admin-page <?php echo esc_attr( 'page-' . $option ); ?>">
		<?php
		/**
		 * Display the updated/error messages.
		 * Only needed as our settings page is not under options, otherwise it will automatically be included.
		 *
		 * @see settings_errors()
		 */
		require_once ABSPATH . 'wp-admin/options-head.php';
		?>
		<h1 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<div class="wpseo_content_wrapper yoast-layout">
			<div class="wpseo_content_cell yoast-main" id="wpseo_content_top">
		<?php
		if ( $form === true ) {
			$enctype = ( $contains_files ) ? ' enctype="multipart/form-data"' : '';

			$action_url       = admin_url( 'options.php' );
			$hidden_fields_cb = 'settings_fields';
			$network_admin    = new Yoast_Network_Admin();
			if ( $network_admin->meets_requirements() ) {
				$action_url       = network_admin_url( 'settings.php' );
				$hidden_fields_cb = [ $network_admin, 'settings_fields' ];
			}

			echo '<form action="' .
				esc_url( $action_url ) .
				'" method="post" id="wpseo-conf"' .
				$enctype . ' accept-charset="' .
				esc_attr( get_bloginfo( 'charset' ) ) .
				'" novalidate="novalidate">';
			call_user_func( $hidden_fields_cb, $option_long_name );
		}
		$this->set_option( $option );
	}

	/**
	 * Set the option used in output for form elements.
	 *
	 * @param string $option_name Option key.
	 *
	 * @since 2.0
	 */
	public function set_option( $option_name ) {
		$this->option_name = $option_name;

		$this->option_instance = WPSEO_Options::get_option_instance( $option_name );
		if ( ! $this->option_instance ) {
			$this->option_instance = null;
		}
	}

	/**
	 * Generates the footer for admin pages.
	 *
	 * @param bool $submit       Whether or not a submit button and form end tag should be shown.
	 * @param bool $show_sidebar Whether or not to show the banner sidebar - used by premium plugins to disable it.
	 *
	 * @since 2.0
	 */
	public function admin_footer( $submit = true, $show_sidebar = true ) {
		if ( $submit ) {
			$settings_changed_listener = new WPSEO_Admin_Settings_Changed_Listener();

			echo '<div id="wpseo-submit-container">';
			submit_button( __( 'Save changes', 'wordpress-seo' ), 'yoast-button yoast-button--primary' );

			$settings_changed_listener->show_success_message();
			echo '</div>';

			echo PHP_EOL . '</form>';
		}

		/**
		 * Apply general admin_footer hooks.
		 */
		do_action( 'wpseo_admin_footer', $this );

		/**
		 * Run possibly set actions to add for example an i18n box.
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
		$addon_manager = new WPSEO_Addon_Manager();
		if ( WPSEO_Utils::is_yoast_seo_premium() && $addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ) ) {
			return;
		}

		require_once 'views/sidebar.php';
	}

	/**
	 * Output a label element.
	 *
	 * @param string $text Label text string.
	 * @param array  $attr HTML attributes set.
	 *
	 * @since 2.0
	 */
	public function label( $text, $attr ) {
		$defaults = [
			'class'      => 'checkbox',
			'close'      => true,
			'for'        => '',
			'aria_label' => '',
		];

		$attr       = wp_parse_args( $attr, $defaults );
		$aria_label = '';
		if ( $attr['aria_label'] !== '' ) {
			$aria_label = ' aria-label="' . esc_attr( $attr['aria_label'] ) . '"';
		}

		echo '<div class="yoast-field-group__title">';
		echo "<label class='" . esc_attr( $attr['class'] ) . "' for='" . esc_attr( $attr['for'] ) . "'$aria_label>$text";
		if ( $attr['close'] ) {
			echo '</label>';
		}
		echo '</div>';
	}

	/**
	 * Output a legend element.
	 *
	 * @param string $text Legend text string.
	 * @param array  $attr HTML attributes set.
	 *
	 * @since 3.4
	 */
	public function legend( $text, $attr ) {
		$defaults = [
			'id'    => '',
			'class' => '',
		];
		$attr     = wp_parse_args( $attr, $defaults );

		$id = ( $attr['id'] === '' ) ? '' : ' id="' . esc_attr( $attr['id'] ) . '"';
		echo '<legend class="yoast-form-legend ' . esc_attr( $attr['class'] ) . '"' . $id . '>' . $text . '</legend>';
	}

	/**
	 * Create a Checkbox input field.
	 *
	 * @param string $var        The variable within the option to create the checkbox for.
	 * @param string $label      The label to show for the variable.
	 * @param bool   $label_left Whether the label should be left (true) or right (false).
	 *
	 * @since 2.0
	 */
	public function checkbox( $var, $label, $label_left = false ) {
		$val = $this->get_field_value( $var, false );

		if ( $val === true ) {
			$val = 'on';
		}

		$class = 'double';
		if ( $label_left !== false ) {
			$this->label( $label_left, [ 'for' => $var ] );
			$class = '';
		}

		echo '<div class="yoast-field-group__checkbox">';
		echo '<input class="checkbox ', esc_attr( $class ), '" type="checkbox" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', checked( $val, 'on', false ), disabled( $this->is_control_disabled( $var ), true, false ), '/>';
		echo '<label for="' . $var . '" class="yoast-field-group__checkbox">' . $label . '</label>';
		echo '</div>';
	}

	/**
	 * Creates a Checkbox input field list.
	 *
	 * @param string $variable The variables within the option to create the checkbox list for.
	 * @param string $labels   The labels to show for the variable.
	 *
	 * @since 12.8
	 */
	public function checkbox_list( $variable, $labels ) {
		$values = $this->get_field_value( $variable, [] );

		foreach ( $labels as $name => $label ) {
			printf(
				'<input class="checkbox double" id="%1$s" type="checkbox" name="%2$s" %3$s value="%4$s"/>',
				esc_attr( $variable . '-' . $name ),
				esc_attr( $this->option_name ) . '[' . esc_attr( $variable ) . '][' . $name . ']',
				checked( ! empty( $values[ $name ] ), true, false ),
				esc_attr( $name )
			);

			printf(
				'<label class="checkbox" for="%1$s">%2$s</label>',
				esc_attr( $variable . '-' . $name ), // #1
				esc_html( $label )
			);
			echo '<br class="clear">';
		}
	}

	/**
	 * Create a light switch input field using a single checkbox.
	 *
	 * @param string $var     The variable within the option to create the checkbox for.
	 * @param string $label   The label element text for the checkbox.
	 * @param array  $buttons Array of two visual labels for the buttons (defaults Disabled/Enabled).
	 * @param string $help    Inline Help that will be printed out before the visible toggles text.
	 * @param bool   $inverse Used when the option is saved inverse, for instance for "noindex-" or "disable-" type options.
	 *
	 * @since 3.1
	 */
	public function light_switch( $var, $label, $buttons = [], $help = '', $inverse = false ) {
		$val = $this->get_field_value( $var, false );

		if ( $val === 'on' ) {
			$val = true;
		}

		$class = 'yoast-toggle';
		if ( $inverse ) {
			$class .= '--inverse';
		}


		if ( empty( $buttons ) ) {
			$buttons = [ __( 'Disabled', 'wordpress-seo' ), __( 'Enabled', 'wordpress-seo' ) ];
		}

		list( $off_button, $on_button ) = $buttons;

		echo '<div class="yoast-toggle__item">',
		'<div class="yoast-toggle__item-title"><label for="', esc_attr( $var ) ,'">', esc_html( $label ), '</label>', $help, '</div>',
		'<div class="', $class, '">',
		'<input type="checkbox" class="yoast-toggle__checkbox" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', checked( $val, true, false ), disabled( $this->is_control_disabled( $var ), true, false ), '/>',
		'<span class="yoast-toggle__switch"></span>',
		'<span class="yoast-toggle--inactive" aria-hidden="true">', esc_html( $off_button ), '</span>',
		'<span class="yoast-toggle--active" aria-hidden="true">', esc_html( $on_button ), '</span>',
		'</div>',
		'</div>';
	}

	/**
	 * Create a disabled switch input field using a single checkbox.
	 *
	 * @param string $var     The variable within the option to create the checkbox for.
	 * @param string $label   The label element text for the checkbox.
	 * @param array  $buttons Array of two visual labels for the buttons (defaults Disabled/Enabled).
	 * @param string $help    Inline Help that will be printed out before the visible toggles text.
	 * @param bool   $inverse Used when the option is saved inverse, for instance for "noindex-" or "disable-" type options.
	 * @param string $url     The URL to link the button to.
	 *
	 * @since 3.1
	 */
	public function light_switch_disabled( $var, $label, $buttons = [], $help = '', $inverse = false, $url ) {
		$class = 'yoast-toggle';
		if ( $inverse ) {
			$class .= '--inverse';
		}


		if ( empty( $buttons ) ) {
			$buttons = [ __( 'Disabled', 'wordpress-seo' ), __( 'Enabled', 'wordpress-seo' ) ];
		}

		list( $off_button, $on_button ) = $buttons;

		echo '<div class="yoast-toggle__item yoast-toggle__item-disabled">',
		'<div class="yoast-toggle__item-title"><label for="', esc_attr( $var ) ,'">', esc_html( $label ), '</label>', $help, '</div>',
		'<div class="', $class, '">',
		'<input type="checkbox" disabled class="yoast-toggle__checkbox" id="', esc_attr( $var ), '" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']" value="on"', '/>',
		'<span class="yoast-toggle__switch"></span>',
		'<span class="yoast-toggle--inactive" aria-hidden="true">', esc_html( $off_button ), '</span>',
		'<span class="yoast-toggle--active" aria-hidden="true">', esc_html( $on_button ), '</span>',
		'</div>',
		'<a href="', $url, '" class="yoast-button yoast-button--buy yoast-button--buy-small">', __( 'Upgrade to premium', 'wordpress-seo' ) ,'<span class="yoast-button--buy__caret"></span></a>',
		'</div>';
	}

	/**
	 * Create a Text input field.
	 *
	 * @param string       $var   The variable within the option to create the text input field for.
	 * @param string       $label The label to show for the variable.
	 * @param array|string $attr  Extra attributes to add to the input field. Can be class, disabled, autocomplete.
	 *
	 * @since 2.1 Introduced the `$attr` parameter.
	 *
	 * @since 2.0
	 */
	public function textinput( $var, $label, $attr = [] ) {

		echo '<div class="yoast-field-group">';
		$type = 'text';

		if ( ! is_array( $attr ) ) {
			$attr = [
				'class'    => $attr,
				'disabled' => false,
			];
		}

		$defaults = [
			'placeholder' => '',
			'class'       => '',
		];
		$attr       = wp_parse_args( $attr, $defaults );
		$val        = $this->get_field_value( $var, '' );
		$attributes = isset( $attr['autocomplete'] ) ? ' autocomplete="' . esc_attr( $attr['autocomplete'] ) . '"' : '';
		if ( isset( $attr['disabled'] ) && $attr['disabled'] ) {
			$attributes .= ' disabled';
		}

		$this->label(
			$label,
			[
				'for'   => $var,
				'class' => 'textinput',
			]
		);

		$has_input_error = Yoast_Input_Validation::yoast_form_control_has_error( $var );
		$aria_attributes = Yoast_Input_Validation::get_the_aria_invalid_attribute( $var );

		Yoast_Input_Validation::set_error_descriptions();
		$aria_attributes .= Yoast_Input_Validation::get_the_aria_describedby_attribute( $var );

		echo '<input' . $attributes . $aria_attributes . ' class="yoast-field-group__inputfield ' . esc_attr( $attr['class'] ) . '
		" placeholder="' . esc_attr( $attr['placeholder'] ) . '
		" type="' . $type . '
		" id="', esc_attr( $var ), '
		" name="', esc_attr( $this->option_name ), '[', esc_attr( $var ), ']
		" value="', esc_attr( $val ), '"', disabled( $this->is_control_disabled( $var ), true, false ), '/>', '</div>';

		echo Yoast_Input_Validation::get_the_error_description( $var );
	}

	/**
	 * Create a textarea.
	 *
	 * @param string       $var   The variable within the option to create the textarea for.
	 * @param string       $label The label to show for the variable.
	 * @param string|array $attr  The CSS class or an array of attributes to assign to the textarea.
	 *
	 * @since 2.0
	 */
	public function textarea( $var, $label, $attr = [] ) {
		echo '<div class="yoast-field-group">';
		if ( ! is_array( $attr ) ) {
			$attr = [
				'class' => $attr,
			];
		}

		$defaults = [
			'cols'  => '',
			'rows'  => '',
			'class' => '',
		];
		$attr     = wp_parse_args( $attr, $defaults );
		$val      = $this->get_field_value( $var, '' );

		$this->label(
			$label,
			[
				'for'   => $var,
				'class' => 'textinput',
			]
		);
		echo '<textarea cols="' . esc_attr( $attr['cols'] ) . '
		" rows="' . esc_attr( $attr['rows'] ) . '
		" class="yoast-field-group__textarea ' . esc_attr( $attr['class'] ) . '
		" id="' . esc_attr( $var ) . '
		" name="' . esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']
		"', disabled( $this->is_control_disabled( $var ), true, false ), '>' . esc_textarea( $val ) . '</textarea>';
		echo '</div>';
	}

	/**
	 * Create a hidden input field.
	 *
	 * @param string $var The variable within the option to create the hidden input for.
	 * @param string $id  The ID of the element.
	 *
	 * @since 2.0
	 */
	public function hidden( $var, $id = '' ) {
		$val = $this->get_field_value( $var, '' );
		if ( is_bool( $val ) ) {
			$val = ( $val === true ) ? 'true' : 'false';
		}

		if ( $id === '' ) {
			$id = 'hidden_' . $var;
		}

		echo '<input type="hidden" id="' . esc_attr( $id ) . '" name="' . esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']" value="' . esc_attr( $val ) . '"/>';
	}

	/**
	 * Create a Select Box.
	 *
	 * @param string $var            The variable within the option to create the select for.
	 * @param string $label          The label to show for the variable.
	 * @param array  $select_options The select options to choose from.
	 * @param string $styled         The select style. Use 'styled' to get a styled select. Default 'unstyled'.
	 * @param bool   $show_label     Whether or not to show the label, if not, it will be applied as an aria-label.
	 *
	 * @since 2.0
	 */
	public function select( $var, $label, array $select_options, $styled = 'unstyled', $show_label = true ) {
		echo '<div class="yoast-field-group">';
		if ( empty( $select_options ) ) {
			return;
		}

		if ( $show_label ) {
			$this->label(
				$label,
				[
					'for'   => $var,
					'class' => 'select',

				]
			);
		}

		$select_name       = esc_attr( $this->option_name ) . '[' . esc_attr( $var ) . ']';
		$active_option     = $this->get_field_value( $var, '' );
		$wrapper_start_tag = '';
		$wrapper_end_tag   = '';

		$select = new Yoast_Input_Select( $var, $select_name, $select_options, $active_option );
		$select->add_attribute( 'class', 'select' );
		if ( $this->is_control_disabled( $var ) ) {
			$select->add_attribute( 'disabled', 'disabled' );
		}
		if ( ! $show_label ) {
			$select->add_attribute( 'aria-label', $label );
		}

		if ( $styled === 'styled' ) {
			$wrapper_start_tag = '<span class="yoast-styled-select">';
			$wrapper_end_tag   = '</span>';
		}

		echo $wrapper_start_tag;
		$select->output_html();
		echo $wrapper_end_tag;
		echo '</div>';
	}

	/**
	 * Create a File upload field.
	 *
	 * @param string $var   The variable within the option to create the file upload field for.
	 * @param string $label The label to show for the variable.
	 *
	 * @since 2.0
	 */
	public function file_upload( $var, $label ) {
		$val = $this->get_field_value( $var, '' );
		if ( is_array( $val ) ) {
			$val = $val['url'];
		}

		$var_esc = esc_attr( $var );
		$this->label(
			$label,
			[
				'for'   => $var,
				'class' => 'select',
			]
		);
		echo '<input type="file" value="' . esc_attr( $val ) . '" class="textinput" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" id="' . $var_esc . '"', disabled( $this->is_control_disabled( $var ), true, false ), '/>';

		// Need to save separate array items in hidden inputs, because empty file inputs type will be deleted by settings API.
		if ( ! empty( $val ) ) {
			$this->hidden( 'file', $this->option_name . '_file' );
			$this->hidden( 'url', $this->option_name . '_url' );
			$this->hidden( 'type', $this->option_name . '_type' );
		}
		echo '<br class="clear"/>';
	}

	/**
	 * Media input.
	 *
	 * @param string $var   Option name.
	 * @param string $label Label message.
	 *
	 * @since 2.0
	 */
	public function media_input( $var, $label ) {
		$val      = $this->get_field_value( $var, '' );
		$id_value = $this->get_field_value( $var . '_id', '' );

		$var_esc = esc_attr( $var );

		$this->label(
			$label,
			[
				'for'   => 'wpseo_' . $var,
				'class' => 'select',
			]
		);

		$id_field_id = 'wpseo_' . $var_esc . '_id';

		echo '<div class="yoast-field-group yoast-field-group__upload">';
			echo '<input',
				' class="textinput yoast-field-group__inputfield"',
				' id="wpseo_', $var_esc, '"',
				' type="text" size="36"',
				' name="', esc_attr( $this->option_name ), '[', $var_esc, ']"',
				' value="', esc_attr( $val ), '"',
				' readonly="readonly"',
				' /> ';
			echo '<input',
				' id="wpseo_', $var_esc, '_button"',
				' class="wpseo_image_upload_button yoast-button yoast-button--secondary yoast-button--upload"',
				' type="button"',
				' value="', esc_attr__( 'Upload image', 'wordpress-seo' ), '"',
				' data-target-id="', esc_attr( $id_field_id ), '"',
				disabled( $this->is_control_disabled( $var ), true, false ),
				' />';
			echo '<input',
				' class="yoast-remove yoast-js-remove-image"',
				' type="button"',
				' value="', esc_attr__( 'Remove image', 'wordpress-seo' ), '"',
				disabled( $this->is_control_disabled( $var ), true, false ),
				' />';
			echo '<input',
				' type="hidden"',
				' id="', esc_attr( $id_field_id ), '"',
				' name="', esc_attr( $this->option_name ), '[', $var_esc, '_id]"',
				' value="', esc_attr( $id_value ), '"',
				' />';
		echo '</div>';
		echo '<br class="clear"/>';
	}

	/**
	 * Create a Radio input field.
	 *
	 * @param string $var         The variable within the option to create the radio button for.
	 * @param array  $values      The radio options to choose from.
	 * @param string $legend      Optional. The legend to show for the field set, if any.
	 * @param array  $legend_attr Optional. The attributes for the legend, if any.
	 *
	 * @since 2.0
	 */
	public function radio( $var, $values, $legend = '', $legend_attr = [] ) {
		if ( ! is_array( $values ) || $values === [] ) {
			return;
		}
		$val = $this->get_field_value( $var, false );

		$var_esc = esc_attr( $var );

		echo '<fieldset class="yoast-form-fieldset wpseo_radio_block" id="' . $var_esc . '">';

		if ( is_string( $legend ) && $legend !== '' ) {

			$defaults = [
				'id'    => '',
				'class' => 'radiogroup',
			];

			$legend_attr = wp_parse_args( $legend_attr, $defaults );

			$this->legend( $legend, $legend_attr );
		}

		foreach ( $values as $key => $value ) {
			$label      = $value;
			$aria_label = '';

			if ( is_array( $value ) ) {
				$label      = isset( $value['label'] ) ? $value['label'] : '';
				$aria_label = isset( $value['aria_label'] ) ? $value['aria_label'] : '';
			}

			$key_esc = esc_attr( $key );
			echo '<input type="radio" class="radio" id="' . $var_esc . '-' . $key_esc . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $val, $key_esc, false ) . disabled( $this->is_control_disabled( $var ), true, false ) . ' />';
			$this->label(
				$label,
				[
					'for'        => $var_esc . '-' . $key_esc,
					'class'      => 'radio',
					'aria_label' => $aria_label,
				]
			);
		}
		echo '</fieldset>';
	}

	/**
	 * Create a Title separator input field.
	 *
	 * @param string $var         The variable within the option to create the separator.
	 * @param array  $values      The title separator options to choose from.
	 * @param string $legend      Optional. The legend to show for the field set, if any.
	 * @param array  $legend_attr Optional. The attributes for the legend, if any.
	 *
	 * @since 14.5
	 */
	public function title_separator( $var, $values, $legend = '', $legend_attr = [] ) {
		if ( ! is_array( $values ) || $values === [] ) {
			return;
		}
		$val = $this->get_field_value( $var, false );

		$var_esc = esc_attr( $var );

		echo '<div class="yoast-field-group__title-separator" id="' . $var_esc . '">';

		if ( is_string( $legend ) && $legend !== '' ) {

			$defaults = [
				'id'    => '',
				'class' => 'radiogroup',
			];

			$legend_attr = wp_parse_args( $legend_attr, $defaults );

			$this->legend( $legend, $legend_attr );
		}

		foreach ( $values as $key => $value ) {
			$label      = $value;
			$aria_label = '';

			if ( is_array( $value ) ) {
				$label      = isset( $value['label'] ) ? $value['label'] : '';
				$aria_label = isset( $value['aria_label'] ) ? $value['aria_label'] : '';
			}

			$key_esc = esc_attr( $key );
			echo '<input type="radio" class="visually-hidden" id="' . $var_esc . '-' . $key_esc . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $val, $key_esc, false ) . disabled( $this->is_control_disabled( $var ), true, false ) . ' />';
			$this->label_title_separator(
				$label,
				[
					'for'        => $var_esc . '-' . $key_esc,
					'class'      => 'radio',
					'aria_label' => $aria_label,
				]
			);
		}
		echo '</div>';
	}

	/**
	 * Output a label element.
	 *
	 * @param string $text Label text string.
	 * @param array  $attr HTML attributes set.
	 *
	 * @since 2.0
	 */
	public function label_title_separator( $text, $attr ) {
		$defaults = [
			'class'      => 'radio',
			'close'      => true,
			'for'        => '',
			'aria_label' => '',
		];

		$attr       = wp_parse_args( $attr, $defaults );
		$aria_label = '';
		if ( $attr['aria_label'] !== '' ) {
			$aria_label = ' aria-label="' . esc_attr( $attr['aria_label'] ) . '"';
		}

		echo "<label class='" . esc_attr( $attr['class'] ) . "' for='" . esc_attr( $attr['for'] ) . "'$aria_label>$text";
		if ( $attr['close'] ) {
			echo '</label>';
		}
	}

	/**
	 * Create a toggle switch input field using two radio buttons.
	 *
	 * @param string $var    The variable within the option to create the radio buttons for.
	 * @param array  $values Associative array of on/off keys and their values to be used as
	 *                       the label elements text for the radio buttons. Optionally, each
	 *                       value can be an array of visible label text and screen reader text.
	 * @param string $label  The visual label for the radio buttons group, used as the fieldset legend.
	 * @param string $help   Inline Help that will be printed out before the visible toggles text.
	 *
	 * @since 3.1
	 */
	public function toggle_switch( $var, $values, $label, $help = '' ) {
		if ( ! is_array( $values ) || $values === [] ) {
			return;
		}
		$val = $this->get_field_value( $var, false );
		if ( $val === true ) {
			$val = 'on';
		}
		if ( $val === false ) {
			$val = 'off';
		}

		$var_esc = esc_attr( $var );

		echo '<div class="switch-container">';
		echo '<fieldset id="', $var_esc, '" class="fieldset-switch-toggle"><legend>', $label, ' ', $help, '</legend>';

		echo $this->get_disabled_note( $var );
		echo '<div class="yoast-toggle">';

		foreach ( $values as $key => $value ) {
			$screen_reader_text_html = '';

			if ( is_array( $value ) ) {
				$screen_reader_text      = $value['screen_reader_text'];
				$screen_reader_text_html = '<span class="screen-reader-text"> ' . esc_html( $screen_reader_text ) . '</span>';
				$value                   = $value['text'];
			}

			$key_esc = esc_attr( $key );
			$for     = $var_esc . '-' . $key_esc;
			echo '<input type="radio" id="' . $for . '" name="' . esc_attr( $this->option_name ) . '[' . $var_esc . ']" value="' . $key_esc . '" ' . checked( $val, $key_esc, false ) . disabled( $this->is_control_disabled( $var ), true, false ) . ' />',
			'<label for="', $for, '">', esc_html( $value ), $screen_reader_text_html, '</label>';
		}

		echo '</div></fieldset><div class="clear"></div></div>' . PHP_EOL . PHP_EOL;
	}

	/**
	 * Creates a toggle switch to define whether an indexable should be indexed or not.
	 *
	 * @param string $var   The variable within the option to create the radio buttons for.
	 * @param string $label The visual label for the radio buttons group, used as the fieldset legend.
	 * @param string $help  Inline Help that will be printed out before the visible toggles text.
	 *
	 * @return void
	 */
	public function index_switch( $var, $label, $help = '' ) {
		$index_switch_values = [
			__( 'Yes', 'wordpress-seo' ),
			__( 'No', 'wordpress-seo' ),
		];

		$this->light_switch(
			$var,
			sprintf(
			/* translators: %s expands to an indexable object's name, like a post type or taxonomy */
				esc_html__( 'Show %s in search results?', 'wordpress-seo' ),
				esc_html( $label )
			),
			$index_switch_values,
			$help,
			true
		);
	}

	/**
	 * Creates a toggle switch to show hide certain options.
	 *
	 * @param string $var          The variable within the option to create the radio buttons for.
	 * @param string $label        The visual label for the radio buttons group, used as the fieldset legend.
	 * @param bool   $inverse_keys Whether or not the option keys need to be inverted to support older functions.
	 * @param string $help         Inline Help that will be printed out before the visible toggles text.
	 *
	 * @return void
	 */
	public function show_hide_switch( $var, $label, $inverse_keys = false, $help = '' ) {
		$show_hide_switch = [
			__( 'Hide', 'wordpress-seo' ),
			__( 'Show', 'wordpress-seo' ),
		];

		$this->light_switch( $var, $label, $show_hide_switch, $help, $inverse_keys );
	}

	/**
	 * Retrieves the value for the form field.
	 *
	 * @param string $field_name    The field name to retrieve the value for.
	 * @param string $default_value The default value, when field has no value.
	 *
	 * @return mixed|null The retrieved value.
	 */
	protected function get_field_value( $field_name, $default_value = null ) {
		return WPSEO_Options::get( $field_name, $default_value );
	}

	/**
	 * Checks whether a given control should be disabled.
	 *
	 * @param string $var The variable within the option to check whether its control should be disabled.
	 *
	 * @return bool True if control should be disabled, false otherwise.
	 */
	protected function is_control_disabled( $var ) {
		if ( $this->option_instance === null ) {
			return false;
		}

		return $this->option_instance->is_disabled( $var );
	}

	/**
	 * Gets the explanation note to print if a given control is disabled.
	 *
	 * @param string $var The variable within the option to print a disabled note for.
	 *
	 * @return string Explanation note HTML string, or empty string if no note necessary.
	 */
	protected function get_disabled_note( $var ) {
		if ( ! $this->is_control_disabled( $var ) ) {
			return '';
		}

		return '<p class="disabled-note">' . esc_html__( 'This feature has been disabled by the network admin.', 'wordpress-seo' ) . '</p>';
	}
}
