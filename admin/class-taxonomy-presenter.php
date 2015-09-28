<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_Presenter
 */
class WPSEO_Taxonomy_Presenter {

	/**
	 * The taxonomy meta data for the current term
	 *
	 * @var array
	 */
	private $tax_meta;

	/**
	 * @param stdClass $term
	 */
	public function __construct( $term ) {
		$this->tax_meta = WPSEO_Taxonomy_Meta::get_term_meta( (int) $term->term_id, $term->taxonomy );
	}

	/**
	 * Displaying the form fields
	 *
	 * @param array $fields
	 */
	public function display_fields( array $fields ) {
		foreach ( $fields as $field_name => $field_options ) {
			$this->form_row( 'wpseo_' . $field_name, $field_options );
		}
	}

	/**
	 * Create a row in the form table.
	 *
	 * @param string $field_name    Variable the row controls.
	 * @param array  $field_options Array with the field configuration.
	 */
	private function form_row( $field_name, array $field_options ) {
		$esc_field_name = esc_attr( $field_name );

		$label = $this->get_label( $field_options['label'], $esc_field_name );
		$field = $this->get_field( $field_options['type'], $esc_field_name, $this->get_field_value( $field_name ), (array) $field_options['options'] );
		$help  = $this->get_help( $field, $field_options['description'], $esc_field_name );

		echo $this->parse_row( $label, $help, $field );
	}

	/**
	 * @param string $field_type  The fieldtype, e.g: text, checkbox, etc.
	 * @param string $field_name  The name of the field.
	 * @param string $field_value The value of the field.
	 * @param array  $options     Array with additional options.
	 *
	 * @return string
	 */
	private function get_field($field_type, $field_name, $field_value, array $options) {

		$class = $this->get_class( $options );
		$field = '';

		switch ( $field_type ) {
			case 'text' :
				$field .= '<input name="' . $field_name . '" id="' . $field_name . '" ' . $class . ' type="text" value="' . esc_attr( $field_value ) . '" size="40"/>';
				break;
			case 'checkbox' :
				$field .= '<input name="' . $field_name . '" id="' . $field_name . '" type="checkbox" ' . checked( $field_value ) . '/>';
				break;
			case 'textarea' :
				$rows = 3;
				if ( ! empty( $options['rows'] ) ) {
					$rows = $options['rows'];
				}
				$field .= '<textarea class="large-text" rows="' . esc_attr( $rows ) . '" id="' . $field_name . '" name="' . $field_name . '">' . esc_textarea( $field_value ) . '</textarea>';
				break;
			case 'upload' :
				$field .= '<input id="' . $field_name . '" type="text" size="36" name="' . $field_name . '" value="' . esc_attr( $field_value ) . '" />';
				$field .= '<input id="' . $field_name . '_button" class="wpseo_image_upload_button button" type="button" value="Upload Image" />';
				break;
			case 'select' :
				if ( is_array( $options ) && $options !== array() ) {
					$field .= '<select name="' . $field_name . '" id="' . $field_name . '">';

					$select_options = ( array_key_exists( 'options', $options ) ) ? $options['options'] : $options;

					foreach ( $select_options as $option => $option_label ) {
						$selected = selected( $option, $field_value, false );
						$field .= '<option ' . $selected . ' value="' . esc_attr( $option ) . '">' . esc_html( $option_label ) . '</option>';
					}
					unset( $option, $option_label, $selected );

					$field .= '</select>';
				}
				break;
			case 'hidden' :
				$field .= '<input name="' . $field_name . '" id="hidden_' . $field_name . '" type="hidden" value="' . esc_attr( $field_value ) . '" />';
				break;
		}

		if ( $field !== '' && ( ! empty( $options['description'] ) && is_string( $options['description'] ) ) ) {
			$field .= '<p class="description">' . $options['description'] . '</p>';
		}

		return $field;
	}

	/**
	 * Getting the value for given field_name
	 *
	 * @param string $field_name
	 *
	 * @return string
	 */
	private function get_field_value( $field_name ) {
		if ( isset( $this->tax_meta[ $field_name ] ) && $this->tax_meta[ $field_name ] !== '' ) {
			return $this->tax_meta[ $field_name ];
		}

		return '';
	}

	/**
	 * Getting the class attributes if $options contains a class key
	 *
	 * @param array $options
	 *
	 * @return string
	 */
	private function get_class( array $options ) {
		if ( ! empty( $options['class'] ) ) {
			return ' class="' . esc_attr( $options['class'] ) . '"';
		}

		return '';
	}

	/**
	 * Getting the label HTML
	 *
	 * @param string $label
	 * @param string $field_name
	 *
	 * @return string
	 */
	private function get_label( $label, $field_name ) {
		if ( $label !== '' ) {
			return '<label for="' . $field_name . '">' . esc_html( $label ) . '</label>';
		}

		return '';
	}

	/**
	 * Returns the help text
	 *
	 * @param string $field_html The generated HTML for the field.
	 * @param string $help_text  The help text that will be displayed.
	 * @param string $field_name The field name.
	 *
	 * @return string
	 */
	private function get_help( $field_html, $help_text, $field_name ) {
		if ( $field_html !== '' && ( is_string( $help_text ) && $help_text !== '' ) ) {
			return $this->parse_help( $field_name, $help_text );
		}

		return '';
	}

	/**
	 * Parsing question mark with the help-text
	 *
	 * @param string $field_name The name of the field where the helptext is generated for.
	 * @param string $help_text  The help text itself.
	 *
	 * @return string
	 */
	private function parse_help( $field_name, $help_text ) {
		static $image_src;

		if ( $image_src === null ) {
			$image_src = plugins_url( 'images/question-mark.png', WPSEO_FILE );
		}

		return  sprintf(
			'<img src="%1$s" class="alignright yoast_help" id="%2$s" alt="%3$s" />',
			$image_src,
			esc_attr( $field_name . 'help' ),
			esc_attr( $help_text )
		);
	}

	/**
	 * Returns the HTML for the row which contains label, help and the field.
	 *
	 * @param string $label The html for the label if there was a label set.
	 * @param string $help  The html for the help, when it's there.
	 * @param string $field The html for the field.
	 *
	 * @return string
	 */
	private function parse_row( $label, $help, $field ) {
		return '<tr><th scope="row">' . $label . $help . '</th><td>' . $field . '</td></tr>';
	}

}
