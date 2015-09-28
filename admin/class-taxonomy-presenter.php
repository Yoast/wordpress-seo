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
	 * @var bool|mixed
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
			if ( empty( $field_options['hide'] ) ) {
				$this->form_row( 'wpseo_' . $field_name, $field_options['label'], $field_options['description'], $field_options['type'], $field_options['options'] );
			}
		}
	}

	/**
	 * Create a row in the form table.
	 *
	 * @param string $field_name      Variable the row controls.
	 * @param string $label    Label for the variable.
	 * @param string $description     Description of the use of the variable.
	 * @param string $type     Type of form row to create.
	 * @param array  $options  Options to use when form row is a select box.
	 */
	private function form_row( $field_name, $label, $description, $type = 'text', $options = array() ) {
		$value = '';
		if ( isset( $this->tax_meta[ $field_name ] ) && $this->tax_meta[ $field_name ] !== '' ) {
			$value = $this->tax_meta[ $field_name ];
		}

		$esc_var = esc_attr( $field_name );
		$field   = '';

		$class = '';
		if ( ! empty( $options['class'] ) ) {
			$class = ' class="' . esc_attr( $options['class'] ) . '"';
		}

		switch ( $type ) {
			case 'text' :
				$field .= '<input name="' . $esc_var . '" id="' . $esc_var . '" ' . $class . ' type="text" value="' . esc_attr( $value ) . '" size="40"/>';
				break;
			case 'checkbox' :
				$field .= '<input name="' . $esc_var . '" id="' . $esc_var . '" type="checkbox" ' . checked( $value ) . '/>';
				break;
			case 'textarea' :
				$rows = 3;
				if ( ! empty( $options['rows'] ) ) {
					$rows = $options['rows'];
				}
				$field .= '<textarea class="large-text" rows="' . esc_attr( $rows ) . '" id="' . $esc_var . '" name="' . $esc_var . '">' . esc_textarea( $value ) . '</textarea>';
				break;
			case 'upload' :
				$field .= '<input id="' . $esc_var . '" type="text" size="36" name="' . $esc_var . '" value="' . esc_attr( $value ) . '" />';
				$field .= '<input id="' . $esc_var . '_button" class="wpseo_image_upload_button button" type="button" value="Upload Image" />';
				break;
			case 'select' :
				if ( is_array( $options ) && $options !== array() ) {
					$field .= '<select name="' . $esc_var . '" id="' . $esc_var . '">';

					$select_options = ( array_key_exists( 'options', $options ) ) ? $options['options'] : $options;

					foreach ( $select_options as $option => $option_label ) {
						$selected = selected( $option, $value, false );
						$field .= '<option ' . $selected . ' value="' . esc_attr( $option ) . '">' . esc_html( $option_label ) . '</option>';
					}
					unset( $option, $option_label, $selected );

					$field .= '</select>';
				}
				break;
			case 'hidden' :
				$field .= '<input name="' . $esc_var . '" id="hidden_' . $esc_var . '" type="hidden" value="' . esc_attr( $value ) . '" />';
				break;
		}

		$help = '';
		if ( $field !== '' && ( is_string( $description ) && $description !== '' ) ) {
			$help = $this->parse_help( $esc_var, $description );
		}

		if ( $field !== '' && ( ! empty( $options['description'] ) && is_string( $options['description'] ) ) ) {
			$field .= '<p class="description">' . $options['description'] . '</p>';
		}

		echo '<tr>
			<th scope="row">' . ( ( '' !== $label ) ? '<label for="' . $esc_var . '">' . esc_html( $label ) . '</label>' : '' ) . '' . $help . '</th>
			<td>' . $field . '</td>
		</tr>';
	}

	/**
	 * Parsing question mark with the help-text
	 *
	 * @param string $field_name
	 * @param string $help_text
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

}
