<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Options\Tabs
 */

/**
 * Class WPSEO_Option_Tab
 */
class WPSEO_Option_Tab {

	/** @var string Name of the tab */
	private $name;

	/** @var string Label of the tab */
	private $label;

	/** @var array Optional arguments */
	private $arguments;

	/**
	 * WPSEO_Option_Tab constructor.
	 *
	 * @param string $name      Name of the tab.
	 * @param string $label     Localized label of the tab.
	 * @param array  $arguments Optional arguments.
	 */
	public function __construct( $name, $label, array $arguments = array() ) {
		$this->name      = sanitize_title( $name );
		$this->label     = $label;
		$this->arguments = $arguments;
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
	 * Gets the video URL.
	 *
	 * @return string The video url.
	 */
	public function get_video_url() {
		return $this->get_argument( 'video_url' );
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
	 * @param string       $variable Variable to retrieve.
	 * @param string|mixed $default  Default to use when variable not found.
	 *
	 * @return mixed|string The retrieved variable.
	 */
	protected function get_argument( $variable, $default = '' ) {
		return array_key_exists( $variable, $this->arguments ) ? $this->arguments[ $variable ] : $default;
	}
}
