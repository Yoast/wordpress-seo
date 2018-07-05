<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_presenter_paper
 */
class WPSEO_presenter_paper {
	/**
	 * @var string
	 */
	private $title;

	/**
	 * @var array The view variables.
	 */
	private $settings;

	/**
	 * @var string
	 */
	private $view_file;

	/**
	 * WPSEO_presenter_paper constructor.
	 *
	 * @param string $title          The title of the
	 * @param string $view_file      The path to the to be included file
	 * @param array  $settings
	 */
	public function __construct( $title, $view_file, array $settings = array() ) {
		$defaults = array(
			'paper_id'    => null,
			'collapsible' => false,
			'expanded'    => true,
			'help_text'   => '',
			'title_after' => '',
		);

		$this->settings  = wp_parse_args( $settings, $defaults );
		$this->title     = $title;
		$this->view_file = $view_file;
	}

	public function render() {
		ob_start();

		extract( $this->get_view_variables() );
		require WPSEO_PATH . 'admin/views/paper-collapsible.php' ;

		$rendered_output = ob_get_contents();
		ob_end_clean();

		return $rendered_output;
	}

	private function get_view_variables() {
		$properties = '';
		if ( ! empty( $this->settings['paper_id'] ) ) {
			$properties = 'id="'. esc_attr( $this->settings['paper_id'] ) . '"';
		}

		$toggle_icon = 'dashicons-arrow-down-alt2';
		$class       = 'toggleable-container toggleable-container-hidden';
		$expanded    = 'false';

		if ( ( bool ) $this->settings[ 'expanded' ] === true ) {
			$toggle_icon = 'dashicons-arrow-up-alt2';
			$class       = 'toggleable-container';
			$expanded    = 'true';
		}

		return array(
			'collapsible' => ( bool ) $this->settings[ 'collapsible' ],
			'title_after' => $this->settings[ 'title_after' ],
			'help_text'   => $this->settings[ 'help_text' ],
			'view_file'   => $this->view_file,
			'properties'  => $properties,
			'toggle_icon' => $toggle_icon,
			'class'       => $class,
			'expanded'    => $expanded,
			'title'       => $this->title,
			'paper_id'    => $this->settings[ 'paper_id' ],
		);
	}
}
