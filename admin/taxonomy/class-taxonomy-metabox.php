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

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $product_title is hardcoded.
		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );

		echo '<div class="inside">';
		echo '<div id="taxonomy_overall"></div>';


		echo '<div class="wpseo-metabox-content">';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $product_title is hardcoded.
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
		$content_sections = [];

		$content_sections[] = $this->get_seo_meta_section();

		$readability_analysis = new WPSEO_Metabox_Analysis_Readability();
		if ( $readability_analysis->is_enabled() ) {
			$content_sections[] = $this->get_readability_meta_section();
		}

		$show_facebook = WPSEO_Options::get( 'opengraph', false );
		$show_twitter  = WPSEO_Options::get( 'twitter', false );

		if ( $show_facebook || $show_twitter ) {
			$content_sections[] = $this->get_social_meta_section( $show_facebook, $show_twitter );
		}

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

			$html_after = $this->taxonomy_tab_content->html( $taxonomy_settings_fields->get() );
		}

		return new WPSEO_Metabox_Section_React(
			'content',
			$label,
			$content,
			[
				'html_after' => $html_after,
			]
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
	 * @param boolean $show_facebook Whether to render the facebook fields.
	 * @param boolean $show_twitter  Whether to render the twitter fields.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_social_meta_section( $show_facebook, $show_twitter ) {
		$this->taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );

		$content = '';

		if ( $show_facebook ) {
			$facebook_fields = $this->taxonomy_social_fields->get_by_network( 'opengraph' );
			$content        .= $this->taxonomy_tab_content->html( $facebook_fields );
		};

		if ( $show_twitter ) {
			$twitter_fields = $this->taxonomy_social_fields->get_by_network( 'twitter' );
			$content       .= $this->taxonomy_tab_content->html( $twitter_fields );
		}

		// Add react target.
		$content .= '<div id="wpseo-section-social"></div>';

		return new WPSEO_Metabox_Section_React(
			'social',
			'<span class="dashicons dashicons-share"></span>' . __( 'Social', 'wordpress-seo' ),
			$content
		);
	}
}
