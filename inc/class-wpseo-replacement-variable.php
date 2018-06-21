<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 * @since   7.7
 */

/**
 * Class WPSEO_Replacement_Variable
 *
 * This class stores the data of a single snippet variable.
 */
class WPSEO_Replacement_Variable {

	/**
	 * @var string The variable to use.
	 */
	protected $variable;

	/**
	 * @var string The label of the replacement variable.
	 */
	protected $label;

	/**
	 * @var string The description of the replacement variable.
	 */
	protected $description;

	/**
	 * WPSEO_Replacement_Variable constructor.
	 *
	 * @param string $variable    The variable that is replaced.
	 * @param string $label       The label of the replacement variable.
	 * @param string $description The description of the replacement variable.
	 *
	 * @return \WPSEO_Replacement_Variable
	 */
	public function __construct( $variable, $label, $description ) {
		$this->variable    = $variable;
		$this->label       = $label;
		$this->description = $description;
	}

	/**
	 * Returns the variable to use.
	 *
	 * @return string
	 */
	public function get_variable() {
		return $this->variable;
	}

	/**
	 * Returns the label of the replacement variable.
	 *
	 * @return string
	 */
	public function get_label() {
		return $this->label;
	}

	/**
	 * Returns the description of the replacement variable.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}
}

