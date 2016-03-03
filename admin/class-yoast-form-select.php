<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class for generating a html select.
 */
class Yoast_Form_Select {

	/**
	 * @var string The field name for the select.
	 */
	private $field_name;

	/**
	 * @var string Complete name for the selects' name attribute.
	 */
	private $select_name;

	/**
	 * @var array Array with the options to parse.
	 */
	private $options;

	/**
	 * @var string The current selected option.
	 */
	private $selected_option;

	/**
	 * Constructor.
	 *
	 * @param string $field_name      The field name for the select.
	 * @param string $select_name     Complete name for the selects' name attribute.
	 * @param array  $options         Array with the options to parse.
	 * @param string $selected_option The current selected option.
	 */
	public function __construct( $field_name, $select_name, array $options, $selected_option ) {
		$this->field_name      = $field_name;
		$this->select_name     = $select_name;
		$this->options         = $options;
		$this->selected_option = $selected_option;
	}

	/**
	 * Returns the generated html for the select.
	 *
	 * @return string
	 */
	public function get_html() {
		$html = sprintf(
			'<select class="select" name="%1$s" id="%2$s">%3$s</select>',
			$this->select_name,
			esc_attr( $this->field_name ),
			$this->parse_options()
		);

		return $html;
	}

	/**
	 * Parses the option and return the rendered html.
	 *
	 * @return string
	 */
	private function parse_options() {
		$return = '';

		// This should be done with php array_filter, but then we need at least version 5.6.
		$sanitized_options = $this->sanitize_options();

		foreach ( $sanitized_options as $value => $label ) {
			$return .= $this->parse_option( $label, $value );
		}

		return $return;
	}

	/**
	 * Filters the unwanted options of the array. We only want options with an empty key and empty value or options where
	 * at least the label is filled.
	 *
	 * @return array
	 */
	private function sanitize_options() {
		$sanitized_options = array();

		foreach ( $this->options as $value => $label ) {
			if( $this->sanitize_option( $label, $value ) ) {
				$sanitized_options[ $value ] = $label;
			}
		}

		return $sanitized_options;
	}

	/**
	 * The option have to be filled or should be totally blank.
	 *
	 * @param string $label The textual-value the option will get.
	 * @param string $value The value for the value attribute.
	 *
	 * @return bool
	 */
	protected function sanitize_option( $label, $value ) {
		$option_is_blank = $label === '' && $value === '';

		return $label !== '' || $option_is_blank;
	}

	/**
	 * Parses the options and return it as a string.
	 *
	 * @param string $label The textual-value the option will get.
	 * @param string $value The value for the value attribute.
	 *
	 * @return string
	 */
	private function parse_option( $label, $value ) {
		$html = sprintf(
			'<option value="%1$s"%2$s>%3$s</option>',
			esc_attr( $value ),
			selected( $this->selected_option, $value, false ),
			esc_html( $label )
		);

		return $html;
	}

}
