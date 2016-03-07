<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class for generating a html select.
 */
class Yoast_Form_Select {

	/**
	 * @var string The ID name for the select.
	 */
	private $select_id;

	/**
	 * @var string Complete name for the selects' name attribute.
	 */
	private $select_name;

	/**
	 * @var string
	 */
	private $select_class;

	/**
	 * @var array Array with the options to parse.
	 */
	private $select_options;

	/**
	 * @var string The current selected option.
	 */
	private $selected_option;

	/**
	 * Constructor.
	 *
	 * @param string $select_id       The field name for the select.
	 * @param string $select_name     Complete name for the selects' name attribute.
	 * @param string $select_class    The classname that the select will get.
	 * @param array  $select_options  Array with the options to parse.
	 * @param string $selected_option The current selected option.
	 */
	public function __construct( $select_id, $select_name, $select_class, array $select_options, $selected_option ) {
		$this->select_id       = $select_id;
		$this->select_name     = $select_name;
		$this->select_class    = $select_class;
		$this->select_options  = $select_options;
		$this->selected_option = $selected_option;
	}

	/**
	 * Returns the set fields for the select
	 * @return array
	 */
	public function get_select_values() {
		return array(
			'select_id'       => $this->select_id,
			'select_name'     => $this->select_name,
			'select_class'    => $this->select_class,
			'select_options'  => $this->filter_invalid_options(),
			'selected_option' => $this->selected_option,
		);
	}

	/**
	 * Filters the invalid options of the array. We only want options with empty key and empty value or options where
	 * at least the label is filled.
	 *
	 * In a fancy world: this should be done with php array_filter, but then we need at least version 5.6.
	 *
	 * @return array
	 */
	private function filter_invalid_options() {
		$sanitized_options = array();

		foreach ( $this->select_options as $value => $label ) {
			if ( $this->is_valid_option( $label, $value ) ) {
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
	protected function is_valid_option( $label, $value ) {
		$option_is_blank = $label === '' && $value === '';

		return $label !== '' || $option_is_blank;
	}

}
