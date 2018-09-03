<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_presenter_paper
 */
class WPSEO_Paper_Presenter {
	/**
	 * @var string Title of the paper
	 */
	private $title;

	/**
	 * @var array The view variables.
	 */
	private $settings;

	/**
	 * @var string The path to the view file.
	 */
	private $view_file;

	/**
	 * WPSEO_presenter_paper constructor.
	 *
	 * @param string $title     The title of the paper.
	 * @param string $view_file The path to the view file.
	 * @param array  $settings  Optional. Settings for the paper.
	 */
	public function __construct( $title, $view_file, array $settings = array() ) {
		$defaults = array(
			'paper_id'    => null,
			'collapsible' => false,
			'expanded'    => false,
			'help_text'   => '',
			'title_after' => '',
			'view_data'   => array(),
		);

		$this->settings  = wp_parse_args( $settings, $defaults );
		$this->title     = $title;
		$this->view_file = $view_file;
	}

	/**
	 * Renders the collapsible paper and returns it as a string.
	 *
	 * @return string The rendered paper.
	 */
	public function get_output() {
		extract( $this->get_view_variables(), EXTR_SKIP );

		ob_start();
		require WPSEO_PATH . 'admin/views/paper-collapsible.php' ;
		$rendered_output = ob_get_clean();

		return $rendered_output;
	}

	/**
	 * Retrieves the view variables.
	 *
	 * @return array The view variables.
	 */
	private function get_view_variables() {
		if ( $this->settings['help_text'] instanceof WPSEO_Admin_Help_Panel === false ) {
			$this->settings['help_text'] = new WPSEO_Admin_Help_Panel( '', '', '' );
		}

		$view_variables = array(
			'collapsible'        => $this->settings['collapsible'],
			'collapsible_config' => $this->collapsible_config(),
			'title_after'        => $this->settings['title_after'],
			'help_text'          => $this->settings['help_text'],
			'view_file'          => $this->view_file,
			'title'              => $this->title,
			'paper_id'           => $this->settings['paper_id'],
			'yform'              => Yoast_Form::get_instance(),
		);

		return array_merge( $this->settings['view_data'], $view_variables );
	}

	/**
	 * Retrieves the collapsible config based on the settings.
	 *
	 * @return array The config.
	 */
	protected function collapsible_config() {
		if ( empty( $this->settings['collapsible'] ) ) {
			return array(
				'toggle_icon' => '',
				'class'       => '',
				'expanded'    => '',
			);
		}

		if ( ! empty( $this->settings['expanded'] ) ) {
			return array(
				'toggle_icon' => 'dashicons-arrow-up-alt2',
				'class'       => 'toggleable-container',
				'expanded'    => 'true',
			);
		}

		return array(
			'toggle_icon' => 'dashicons-arrow-down-alt2',
			'class'       => 'toggleable-container toggleable-container-hidden',
			'expanded'    => 'false',
		);
	}
}
