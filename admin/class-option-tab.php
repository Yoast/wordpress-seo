<?php
/**
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
	 * Get the name
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Get the label
	 *
	 * @return string
	 */
	public function get_label() {
		return $this->label;
	}

	/**
	 * Get the video URL
	 *
	 * @return string
	 */
	public function get_video_url() {
		return $this->get_argument( 'video_url' );
	}

	/**
	 * Retrieve whether the tab needs a save button
	 *
	 * @return bool
	 */
	public function has_save_button() {
		return (bool) $this->get_argument( 'save_button', true );
	}

	/**
	 * Get the option group
	 *
	 * @return string
	 */
	public function get_opt_group() {
		return $this->get_argument( 'opt_group' );
	}

	/**
	 * Get the variable from the supplied arguments
	 *
	 * @param string       $variable Variable to retrieve.
	 * @param string|mixed $default  Default to use when variable not found.
	 *
	 * @return mixed|string
	 */
	protected function get_argument( $variable, $default = '' ) {
		return array_key_exists( $variable, $this->arguments ) ? $this->arguments[ $variable ] : $default;
	}
}
