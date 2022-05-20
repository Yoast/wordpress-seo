<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Options\Tabs
 */

/**
 * Class WPSEO_Option_Tab.
 */
class WPSEO_Option_Tab {

	/**
	 * Name of the tab.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * Wether we allow or not html entities in the tab label.
	 *
	 * @var bool
	 */
	private $allow_html_label;

	/**
	 * Label of the tab.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * Optional arguments.
	 *
	 * @var array
	 */
	private $arguments;

	/**
	 * WPSEO_Option_Tab constructor.
	 *
	 * @param string $name             Name of the tab.
	 * @param string $label            Localized label of the tab.
	 * @param array  $arguments        Optional arguments.
	 * @param bool   $allow_html_label Wether or not html entities are allowed in the tab label.
	 */
	public function __construct( $name, $label, array $arguments = [], $allow_html_label = false ) {
		$this->name             = sanitize_title( $name );
		$this->label            = $label;
		$this->arguments        = $arguments;
		$this->allow_html_label = $allow_html_label;
	}

	/**
	 * Gets the name.
	 *
	 * @return string The name.
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Gets the label.
	 *
	 * @return string The label.
	 */
	public function get_label() {
		return $this->label;
	}

	/**
	 * Retrieves whether the tab needs a save button.
	 *
	 * @return bool True whether the tabs needs a save button.
	 */
	public function has_save_button() {
		return (bool) $this->get_argument( 'save_button', true );
	}

	/**
	 * Gets the option group.
	 *
	 * @return string The option group.
	 */
	public function get_opt_group() {
		return $this->get_argument( 'opt_group' );
	}

	/**
	 * Retrieves the variable from the supplied arguments.
	 *
	 * @param string       $variable      Variable to retrieve.
	 * @param string|mixed $default_value Default to use when variable not found.
	 *
	 * @return mixed|string The retrieved variable.
	 */
	protected function get_argument( $variable, $default_value = '' ) {
		return array_key_exists( $variable, $this->arguments ) ? $this->arguments[ $variable ] : $default_value;
	}

	/**
	 * Retrieves wether or not html entities are allowed in the tab label.
	 *
	 * @return bool True when html entities are allowed in the tab label .
	 */
	public function is_html_label_allowed() {
		return $this->allow_html_label;
	}
}
