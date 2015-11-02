<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit term page.
 */
class WPSEO_Taxonomy_Metabox {

	/**
	 * @var stdClass
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
	 * The constructor.
	 *
	 * @param string   $taxonomy The taxonomy.
	 * @param stdClass $term     The term.
	 */
	public function __construct( $taxonomy, $term ) {
		$this->term                 = $term;
		$this->taxonomy             = $taxonomy;
		$this->taxonomy_tab_content = new WPSEO_Taxonomy_Fields_Presenter( $this->term );

		add_action( 'admin_footer', array( $this, 'scoring_svg' ) );
	}

	/**
	 * Shows the Yoast SEO metabox for the term.
	 */
	public function display() {
		if ( $this->tax_is_public() === false ) {
			return;
		}

		$content_sections = $this->get_content_sections();

		$product_title = 'Yoast SEO';
		if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
			$product_title .= ' Premium';
		}
		/* translators: %1$s expands to Yoast SEO */
		$metabox_heading = sprintf( __( '%1$s Settings', 'wordpress-seo' ), $product_title );

		printf( '<div id="poststuff" class="postbox"><h3><span>%1$s</span></h3><div class="inside">' , $metabox_heading );

		echo '<div class="wpseo-metabox-sidebar"><ul>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_link();
		}

		echo '</ul></div>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_content();
		}
		echo '<div id="taxonomy_overall"></div></div></div>';
	}

	/**
	 * Returns the relevant metabox sections for the current view.
	 *
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_content_sections() {
		$content_sections = array(
			$this->get_content_meta_section(),
			$this->get_settings_meta_section(),
			$this->get_social_meta_section(),
		);

		return $content_sections;
	}

	/**
	 * Returns the metabox section for the content analysis.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_content_meta_section() {
		$taxonomy_content_fields = new WPSEO_Taxonomy_Content_Fields( $this->term );
		$content = $this->taxonomy_tab_content->html( $taxonomy_content_fields->get() );

		$tab = new WPSEO_Metabox_Form_Tab(
			'content',
			$content,
			__( 'Content', 'wordpress-seo' ),
			array(
				'link_class' => 'wpseo_keyword_tab',
				'link_title' => __( 'Content', 'wordpress-seo' ),
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'content',
			'<span class="dashicons dashicons-yes"></span>',
			array( $tab ),
			array(
				'link_alt'   => __( 'Content', 'wordpress-seo' ),
				'link_title' => __( 'Content', 'wordpress-seo' ),
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
		$content = $this->taxonomy_tab_content->html( $taxonomy_settings_fields->get() );

		$tab = new WPSEO_Metabox_Form_Tab(
			'settings',
			$content,
			__( 'Settings', 'wordpress-seo' ),
			array(
				'link_title' => __( 'Settings', 'wordpress-seo' ),
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'settings',
			'<span class="dashicons dashicons-admin-generic"></span>',
			array( $tab ),
			array(
				'link_alt'   => __( 'Settings', 'wordpress-seo' ),
				'link_title' => __( 'Settings', 'wordpress-seo' ),
			)
		);
	}

	/**
	 * Returns the metabox section for the social settings.
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_social_meta_section() {
		$options = WPSEO_Options::get_all();
		$taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );

		$tabs = array();
		if ( $options['opengraph'] === true ) {
			$facebook_meta_fields = $taxonomy_social_fields->get_by_network( 'opengraph' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'facebook',
				$this->taxonomy_tab_content->html( $facebook_meta_fields ),
				'<span class="dashicons dashicons-facebook-alt"></span>',
				array(
					'link_alt'   => __( 'Facebook / Opengraph metadata', 'wordpress-seo' ),
					'link_title' => __( 'Facebook / Opengraph metadata', 'wordpress-seo' ),
				)
			);
		}

		if ( $options['twitter'] === true ) {
			$twitter_meta_fields = $taxonomy_social_fields->get_by_network( 'twitter' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'twitter',
				$this->taxonomy_tab_content->html( $twitter_meta_fields ),
				'<span class="dashicons dashicons-twitter"></span>',
				array(
					'link_alt'   => __( 'Twitter metadata', 'wordpress-seo' ),
					'link_title' => __( 'Twitter metadata', 'wordpress-seo' ),
				)
			);
		}

		if ( $options['googleplus'] === true ) {
			$googleplus_meta_fields = $taxonomy_social_fields->get_by_network( 'googleplus' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'googleplus',
				$this->taxonomy_tab_content->html( $googleplus_meta_fields ),
				'<span class="dashicons dashicons-googleplus"></span>',
				array(
					'link_alt'   => __( 'Google+ metadata', 'wordpress-seo' ),
					'link_title' => __( 'Google+ metadata', 'wordpress-seo' ),
				)
			);
		}

		return new WPSEO_Metabox_Tab_Section(
			'social',
			'<span class="dashicons dashicons-share"></span>',
			$tabs,
			array(
				'link_alt'   => __( 'Social', 'wordpress-seo' ),
				'link_title' => __( 'Social', 'wordpress-seo' ),
			)
		);
	}

	/**
	 * Test whether we are on a public taxonomy - no metabox actions needed if we are not
	 * Unfortunately we have to hook most everything in before the point where all taxonomies are registered and
	 * we know which taxonomy is being requested, so we need to use this check in nearly every hooked in function.
	 *
	 * @since 1.5.0
	 */
	private function tax_is_public() {
		// Don't make static as taxonomies may still be added during the run.
		$taxonomy = get_taxonomy( $this->taxonomy );

		return $taxonomy->public;
	}

	/**
	 * SVG for the general SEO score.
	 */
	public function scoring_svg() {
		echo '<script type="text/html" id="tmpl-score_svg">
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve" width="50" height="50">
					<g id="BG"></g>
					<g id="BG_dark"></g>
					<g id="bg_light"><path fill="#5B2942" d="M415,500H85c-46.8,0-85-38.2-85-85V85C0,38.2,38.2,0,85,0h330c46.8,0,85,38.2,85,85v330	C500,461.8,461.8,500,415,500z"/>
						<path fill="none" stroke="#7EADB9" stroke-width="17" stroke-miterlimit="10" d="M404.6,467H95.4C61.1,467,33,438.9,33,404.6V95.4	C33,61.1,61.1,33,95.4,33h309.2c34.3,0,62.4,28.1,62.4,62.4v309.2C467,438.9,438.9,467,404.6,467z"/>
					</g>
					<g id="Layer_2">
						<circle id="score_circle_shadow" fill="#77B227" cx="250" cy="250" r="155"/>
						<path id="score_circle" fill="#9FDA4F" d="M172.5,384.2C98.4,341.4,73,246.6,115.8,172.5S253.4,73,327.5,115.8"/>
						<g>
							<g>
								<g display="none">
									<path display="inline" fill="#FEC228" d="M668,338.4c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
									<path display="inline" fill="#8BDA53" d="M668,215.1c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
									<path display="inline" fill="#FF443D" d="M668,461.7c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</script>';
	}
}
