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
	 * @var string The label of the replacement variable.
	 */
	protected $label;

	/**
	 * @var string The description of the replacement variable.
	 */
	protected $description;

	/**
	 * WPSEO_Replace_Var_Data constructor.
	 *
	 * @param string $label         The label of the replacement variable.
	 * @param string $description   The description of the replacement variable.
	 *
	 * @return \WPSEO_Replace_Var_Data
	 */
	public function __construct( $label, $description ) {
		$this->label = $label;
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
	 * Returns the description of the replacement variable.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}
}

