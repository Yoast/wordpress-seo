<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class for generating a html select.
 */
class Yoast_Input_Select {

	/**
	 * @var array
	 */
	private $select_attributes = array();

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
	 * @param array  $select_attributes Attributes for the select, should contains: id, name and class.
	 * @param array  $select_options    Array with the options to parse.
	 * @param string $selected_option   The current selected option.
	 */
	public function __construct( array $select_attributes, array $select_options, $selected_option ) {

		$this->validate_attributes( $select_attributes );

		$this->select_attributes = $select_attributes;
		$this->select_options    = $select_options;
		$this->selected_option   = $selected_option;
	}

	/**
	 * Print the rendered view.
	 */
	public function output_html() {
		echo $this->get_html();
	}

	/**
	 * Return the rendered view
	 *
	 * @return string
	 */
	public function get_html() {
		ob_start();

		// Extract it, because we want each value accessible via a variable instead of accessing it as an array.
		extract( $this->get_select_values() );

		require( dirname( WPSEO_FILE ) . '/admin/views/form/select.php' );

		$rendered_output = ob_get_contents();
		ob_end_clean();

		return $rendered_output;
	}

	/**
	 * Check if the required attributes are given. When one is missing throw an InvalidArgumentException
	 *
	 * @param array $select_attributes The attributes we want to validate.
	 *
	 * @throws InvalidArgumentException The exception when a field is missing.
	 */
	private function validate_attributes( array $select_attributes ) {
		if ( ! array_key_exists( 'id', $select_attributes ) ) {
			throw new InvalidArgumentException( 'The select attributes should contain a `id` value' );
		}

		if ( ! array_key_exists( 'name', $select_attributes ) ) {
			throw new InvalidArgumentException( 'The select attributes should contain a `name` value' );
		}

		if ( ! array_key_exists( 'class', $select_attributes ) ) {
			throw new InvalidArgumentException( 'The select attributes should contain a `class` value' );
		}
	}

	/**
	 * Returns the set fields for the select
	 * @return array
	 */
	private function get_select_values() {
		return array(
			'id'       => $this->select_attributes['id'],
			'name'     => $this->select_attributes['name'],
			'class'    => $this->select_attributes['class'],
			'options'  => $this->select_options,
			'selected' => $this->selected_option,
		);
	}

}
