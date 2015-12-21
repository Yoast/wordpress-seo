<?php
/**
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
	 * @var string The type of result (error|warning)
	 */
	protected $type;

	/**
	 * @param string $message The validation message contained by the result.
	 */
	public function __construct( $message ) {
		$this->message = $message;
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
	 * Gets the validation result type.
	 *
	 * @return string
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Returns an Array representation of the validation result.
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'type'    => $this->type,
			'message' => $this->message,
		);
	}
}
