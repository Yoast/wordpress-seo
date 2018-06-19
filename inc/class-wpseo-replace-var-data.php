<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 * @since   7.0
 */

/**
 * Class WPSEO_Replace_Var_Data
 *
 * This class is used by class-wpseo-replace-vars to store the data of a single row of the snippet variables table.
 */
class WPSEO_Replace_Var_Data {

	/**
	 * @var string  The label, or niceName, of the replacement variable.
	 */
	protected $label;

	/**
	 * @var string  The variable to use.
	 */
	protected $variable;

	/**
	 * @var string  The description of the replacement variable.
	 */
	protected $description;

	/**
	 * WPSEO_Replace_Var_Data constructor.
	 *
	 * @param string $label         The label, or niceName, of the replacement variable.
	 * @param string $variable      The variable to use.
	 * @param string $description   The description of the replacement variable.
	 *
	 * @return \WPSEO_Replace_Var_Data
	 */
	public function __construct( $label, $variable, $description ) {
		$this->label = $label;
		$this->variable = $variable;
		$this->description = $description;
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
	 * Returns the variable the users should use.
	 *
	 * @return string
	 */
	public function get_variable() {
		return $this->variable;
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

