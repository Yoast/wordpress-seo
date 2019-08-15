<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit term page.
 */
class WPSEO_Taxonomy_Metabox {

	/**
	 * The term currently being edited.
	 *
	 * @var WP_Term
	 */
	private $term;

	/**
	 * The term's taxonomy.
	 *
	 * @var string
	 */
	private $taxonomy;

	/**
	 * Renders the taxonomy field.
	 *
	 * @var WPSEO_Taxonomy_Fields_Presenter
	 */
	private $taxonomy_tab_content;

	/**
	 * Renders the taxonomy social fields.
	 *
	 * @var WPSEO_Taxonomy_Social_Fields
	 */
	private $taxonomy_social_fields;

	/**
	 * This class adds the Social tab to the Yoast SEO metabox and makes sure the settings are saved.
	 *
	 * @var WPSEO_Social_Admin
	 */
	private $social_admin;

	/**
	 * The constructor.
	 *
	 * @param string   $taxonomy The taxonomy.
	 * @param stdClass $term     The term.
	 */
	public function __construct( $taxonomy, $term ) {
		$this->term                 = $term;
		$this->taxonomy             = $taxonomy;
		$this->taxonomy_tab_content = new WPSEO_Taxonomy_Fields_Presenter( $this->term );
	}

	/**
	 * Shows the Yoast SEO metabox for the term.
	 */
	public function display() {

		$content_sections = $this->get_content_sections();

		$product_title = 'Yoast SEO';
		if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
			$product_title .= ' Premium';
		}

		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );

		echo '<div class="inside">';
		echo '<div id="taxonomy_overall"></div>';


		echo '<div class="wpseo-metabox-content">';
		printf( '<div class="wpseo-metabox-menu"><ul role="tablist" class="yoast-aria-tabs" aria-label="%s">', $product_title );

		foreach ( $content_sections as $content_section ) {
			$content_section->display_link();
		}

		echo '</ul></div>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_content();
		}

		echo '</div></div>';
		echo '</div>';
	}

	/**
	 * Returns the relevant metabox sections for the current view.
	 *
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_content_sections() {
		$content_sections = array();

		$content_sections[] = $this->get_seo_meta_section();

		$readability_analysis = new WPSEO_Metabox_Analysis_Readability();
		if ( $readability_analysis->is_enabled() ) {
			$content_sections[] = $this->get_readability_meta_section();
		}

		$content_sections[] = $this->get_social_meta_section();

		return $content_sections;
	}

	/**
	 * Returns the metabox section for the content analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_seo_meta_section() {
		$taxonomy_content_fields = new WPSEO_Taxonomy_Content_Fields( $this->term );
		$content                 = $this->taxonomy_tab_content->html( $taxonomy_content_fields->get( $this->term ) );

		$seo_analysis = new WPSEO_Metabox_Analysis_SEO();
		$label        = __( 'SEO', 'wordpress-seo' );

		if ( $seo_analysis->is_enabled() ) {
			$label = '<span class="wpseo-score-icon-container" id="wpseo-seo-score-icon"></span>' . $label;
		}

		$html_after = '';

		if ( WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) || WPSEO_Options::get( 'disableadvanced_meta' ) === false ) {
			$taxonomy_settings_fields = new WPSEO_Taxonomy_Settings_Fields( $this->term );

			$advanced_collapsible = new WPSEO_Paper_Presenter(
				__( 'Advanced', 'wordpress-seo' ),
				null,
				array(
					'collapsible' => true,
					'class'       => 'metabox wpseo-form wpseo-collapsible-container',
					'content'     => $this->taxonomy_tab_content->html( $taxonomy_settings_fields->get() ),
					'paper_id'    => 'collapsible-advanced-settings',
				)
			);

			$html_after = '<div class="wpseo_content_wrapper">' . $advanced_collapsible->get_output() . '</div>';
		}

		return new WPSEO_Metabox_Section_React(
			'content',
			$label,
			$content,
			array(
				'html_after' => $html_after,
			)
		);
	}

	/**
	 * Returns the metabox section for the readability analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_readability_meta_section() {
		return new WPSEO_Metabox_Section_Readability();
	}

	/**
	 * Returns the metabox section for the social settings.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_social_meta_section() {
		$this->taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );
		$this->social_admin           = new WPSEO_Social_Admin();

		$collapsibles   = array();
		$collapsibles[] = $this->create_collapsible( 'facebook', 'opengraph', 'facebook-alt', __( 'Facebook', 'wordpress-seo' ) );
		$collapsibles[] = $this->create_collapsible( 'twitter', 'twitter', 'twitter', __( 'Twitter', 'wordpress-seo' ) );

		return new WPSEO_Metabox_Collapsibles_Sections(
			'social',
			'<span class="dashicons dashicons-share"></span>' . __( 'Social', 'wordpress-seo' ),
			$collapsibles
		);
	}

	/**
	 * Creates a social network tab.
	 *
	 * @param string $name    The name of the tab.
	 * @param string $network The network of the tab.
	 * @param string $icon    The icon for the tab.
	 * @param string $label   The label for the tab.
	 *
	 * @return WPSEO_Metabox_Tab A WPSEO_Metabox_Tab instance.
	 */
	private function create_collapsible( $name, $network, $icon, $label ) {
		if ( WPSEO_Options::get( $network ) !== true ) {
			return new WPSEO_Metabox_Null_Tab();
		}

		$meta_fields = $this->taxonomy_social_fields->get_by_network( $network );
		$content     = $this->taxonomy_tab_content->html( $meta_fields );

		/**
		 * If premium hide the form to show the social preview instead, we still need the fields to be output because
		 * the values of the social preview are saved in the hidden field.
		 */
		$features = new WPSEO_Features();
		if ( $features->is_premium() ) {
			$content = $this->hide_form( $content );
		}

		$tab_settings = new WPSEO_Metabox_Collapsible(
			$name,
			$this->social_admin->get_premium_notice( $network ) . $content,
			$label
		);

		return $tab_settings;
	}

	/**
	 * Hides the given output when rendered to HTML.
	 *
	 * @param string $tab_content The social tab content.
	 *
	 * @return string The content.
	 */
	private function hide_form( $tab_content ) {
		return '<div class="hidden">' . $tab_content . '</div>';
	}
}
