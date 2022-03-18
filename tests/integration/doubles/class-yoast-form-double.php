<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Admin
 */

/**
 * Class Yoast_Form_Double.
 */
class Yoast_Form_Double extends Yoast_Form {

	/**
	 * Getter to retrieve the otherwise protected option instance property.
	 *
	 * @return WPSEO_Option|null Option instance, or null if none set.
	 */
	public function get_option_instance() {
		return $this->option_instance;
	}

	/**
	 * Wrapper calling the parent method to make it public and unit-testable.
	 *
	 * @param string $var The variable within the option to check whether its control should be disabled.
	 *
	 * @return bool True if control should be disabled, false otherwise.
	 */
	public function is_control_disabled( $variable ) {
		return parent::is_control_disabled( $variable );
	}
}
