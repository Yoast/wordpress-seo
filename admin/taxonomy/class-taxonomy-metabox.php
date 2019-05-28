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
	 * @var WP_Term
	 */
	private $term;

	/**
	 * @var string
	 */
	private $taxonomy;

	/**
	 * @var WPSEO_Taxonomy_Fields_Presenter
	 */
	private $taxonomy_tab_content;

	/**
	 * @var WPSEO_Taxonomy_Social_Fields
	 */
	private $taxonomy_social_fields;

	/**
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
		echo '<div class="wpseo-metabox-sidebar"><ul>';

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

		$content_sections[] = $this->get_content_meta_section();
		$content_sections[] = $this->get_social_meta_section();
		$content_sections[] = $this->get_settings_meta_section();

		return $content_sections;
	}

	/**
	 * Returns the metabox section for the content analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_content_meta_section() {
		$taxonomy_content_fields = new WPSEO_Taxonomy_Content_Fields( $this->term );
		$content                 = $this->taxonomy_tab_content->html( $taxonomy_content_fields->get( $this->term ) );


		return new WPSEO_Metabox_Section_React(
			'content',
			'<span class="screen-reader-text">' . __( 'Content optimization', 'wordpress-seo' ) . '</span><span class="yst-traffic-light-container">' . WPSEO_Utils::traffic_light_svg() . '</span>',
			$content,
			array(
				'link_aria_label' => __( 'Content optimization', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
		);
	}

	/**
	 * Returns the metabox section for the settings.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_settings_meta_section() {
		$taxonomy_settings_fields = new WPSEO_Taxonomy_Settings_Fields( $this->term );
		$content                  = $this->taxonomy_tab_content->html( $taxonomy_settings_fields->get() );

		$tab = new WPSEO_Metabox_Form_Tab(
			'settings',
			$content,
			__( 'Settings', 'wordpress-seo' ),
			array(
				'single' => true,
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'settings',
			'<span class="screen-reader-text">' . __( 'Settings', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-admin-generic"></span>',
			array( $tab ),
			array(
				'link_aria_label' => __( 'Settings', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
		);
	}

	/**
	 * Returns the metabox section for the social settings.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_social_meta_section() {
		$this->taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );
		$this->social_admin           = new WPSEO_Social_Admin();

		$tabs   = array();
		$tabs[] = $this->create_tab( 'facebook', 'opengraph', 'facebook-alt', __( 'Facebook / Open Graph metadata', 'wordpress-seo' ) );
		$tabs[] = $this->create_tab( 'twitter', 'twitter', 'twitter', __( 'Twitter metadata', 'wordpress-seo' ) );

		return new WPSEO_Metabox_Tab_Section(
			'social',
			'<span class="screen-reader-text">' . __( 'Social', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-share"></span>',
			$tabs,
			array(
				'link_aria_label' => __( 'Social', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
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
	 * @return WPSEO_Metabox_Form_Tab A WPSEO_Metabox_Form_Tab instance.
	 */
	private function create_tab( $name, $network, $icon, $label ) {
		if ( WPSEO_Options::get( $network ) !== true ) {
			return new WPSEO_Metabox_Null_Tab();
		}

		$meta_fields = $this->taxonomy_social_fields->get_by_network( $network );

		$tab_settings = new WPSEO_Metabox_Form_Tab(
			$name,
			$this->social_admin->get_premium_notice( $network ) . $this->taxonomy_tab_content->html( $meta_fields ),
			'<span class="screen-reader-text">' . $label . '</span><span class="dashicons dashicons-' . $icon . '"></span>',
			array(
				'link_aria_label' => $label,
				'link_class'      => 'yoast-tooltip yoast-tooltip-se',
				'single'          => $this->has_single_social_tab(),
			)
		);

		return $tab_settings;
	}

	/**
	 * Determine whether we only show one social network or two.
	 *
	 * @return bool
	 */
	private function has_single_social_tab() {
		return ( WPSEO_Options::get( 'opengraph' ) === false || WPSEO_Options::get( 'twitter' ) === false );
	}
}
