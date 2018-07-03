<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class that adds a template variables explanation tab to the Help Center.
 */
class WPSEO_Help_Center_Template_Variables_Tab implements WPSEO_WordPress_Integration {

	/**
	 * Priority to hook into the tab filter.
	 *
	 * @var int
	 */
	private $priority;

	/**
	 * Tab constructor.
	 *
	 * @param int $priority The priority to add the filter on, allows for ordering.
	 */
	public function __construct( $priority = 10 ) {
		$this->priority = $priority;
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'wpseo_help_center_items', array( $this, 'add_meta_options_help_center_tabs' ), $this->priority );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues the styles needed in the Help Center tab.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'admin-css' );
	}

	/**
	 * Adds help tabs.
	 *
	 * @param array $tabs Current help center tabs.
	 *
	 * @return array List containing all the additional tabs.
	 */
	public function add_meta_options_help_center_tabs( $tabs ) {
		$tabs[] = new WPSEO_Help_Center_Item(
			'template-variables',
			__( 'Snippet variables', 'wordpress-seo' ),
			array( 'content' => $this->get_content() )
		);

		return $tabs;
	}

	/**
	 * Adds template variables to the help center.
	 *
	 * @return string The content for the template variables tab.
	 */
	private function get_content() {
		$explanation = sprintf(
			/* translators: %1$s expands to Yoast SEO. */
			__( 'The search appearance settings for %1$s are made up of variables that are replaced by specific values from the page when the page is displayed. The table below contains a list of the available variables.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$output_explanation = sprintf(
			'<h2 class="wpseo-help-center-sub-title">%s</h2><p>%s</p><p>%s</p>',
			esc_html( __( 'Snippet variables', 'wordpress-seo' ) ),
			esc_html( $explanation ),
			esc_html( __( 'Note that not all variables can be used in every field.', 'wordpress-seo' ) )
		);

		$output_basic = sprintf(
			'<h2 class="wpseo-help-center-sub-title">%s</h2>%s',
			esc_html( __( 'Basic Variables', 'wordpress-seo' ) ),
			WPSEO_Replace_Vars::get_basic_help_texts()
		);

		$output_advanced = sprintf(
			'<h2 class="wpseo-help-center-sub-title">%s</h2>%s',
			esc_html( __( 'Advanced Variables', 'wordpress-seo' ) ),
			WPSEO_Replace_Vars::get_advanced_help_texts()
		);

		return $output_explanation . $output_basic . $output_advanced;
	}
}
