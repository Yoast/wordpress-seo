<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Collapsible_Presenter. Extends the WPSEO_presenter_paper class to make borderless papers.
 */
class WPSEO_Collapsible_Presenter extends WPSEO_Paper_Presenter {

	/**
	 * WPSEO_presenter_collapsible constructor.
	 *
	 * @param string $title     The title of the collapsible.
	 * @param string $view_file Optional. The path to the view file. Use the content setting if you do not wish to use
	 *                          a view file.
	 * @param array  $settings  Optional. Settings for the collapsible.
	 */
	public function __construct( $title, $view_file = '', array $settings = [] ) {
		$defaults = [
			'paper_id'                 => null,
			'paper_id_prefix'          => 'wpseo-',
			'collapsible'              => false,
			'collapsible_header_class' => '',
			'expanded'                 => false,
			'help_button'              => '',
			'title_after'              => '',
			'class'                    => '',
			'content'                  => '',
			'view_data'                => [],
		];

		$settings = wp_parse_args( $settings, $defaults );
		$title     = $title;
		$view_file = $view_file;

		parent::__construct( $title, $view_file, $settings );
	}

	/**
	 * Renders the collapsible and returns it as a string.
	 *
	 * @return string The rendered collapsible.
	 */
	public function get_output() {

		$view_variables = $this->get_view_variables();

		extract( $view_variables, EXTR_SKIP );

		$content = $this->settings['content'];

		if ( ! empty( $this->view_file ) ) {
			ob_start();
			require $this->view_file;
			$content = ob_get_clean();
		}

		ob_start();
		require WPSEO_PATH . 'admin/views/collapsible.php';
		$rendered_output = ob_get_clean();

		return $rendered_output;
	}
}
