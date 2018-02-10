<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Abstract class for different possible validation results.
 */
abstract class WPSEO_Validation_Result {

	/**
	 * @var string The validation message contained by the result.
	 */
	protected $message;

	/**
	 * @var array The field that has the error.
	 */
	private $fields = array();

	/**
	 * Gets the validation result type.
	 *
	 * @return string
	 */
	abstract public function get_type();

	/**
	 * Constructing the object.
	 *
	 * @param string       $message The validation message contained by the result.
	 * @param string|array $fields  The fields that errored.
	 */
	public function __construct( $message, $fields = array() ) {
		$this->message = $message;
		$this->set_fields( $fields );
	}

	/**
	 * Gets the validation result message.
	 *
	 * @return string
	 */
	public function get_message() {
		return $this->message;
	}

	/**
	 * Returns an Array representation of the validation result.
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'type'    => $this->get_type(),
			'message' => $this->message,
			'fields'  => $this->fields,
		);
	}

	/**
	 * Setting the fields with errors.
	 *
	 * @param string $fields The fields with errors on it.
	 */
	protected function set_fields( $fields = '' ) {
		if ( ! is_array( $fields ) && is_string( $fields ) ) {
			$fields = array( $fields );
		}

		$this->fields = $fields;
	}
}
