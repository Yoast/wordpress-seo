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

		add_action( 'admin_footer', array( $this, 'template_keyword_tab' ) );
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

		printf( '<div id="poststuff" class="postbox"><h3><span>%1$s</span></h3><div id="taxonomy_overall"></div><div class="inside">' , $product_title );
		echo '<div class="wpseo-metabox-sidebar"><ul>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_link();
		}

		echo '</ul></div>';

		foreach ( $content_sections as $content_section ) {
			$content_section->display_content();
		}
		echo '</div></div>';
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
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'content',
			'<span class="yst-traffic-light-container">' . $this->traffic_light_svg() . '</span>',
			array( $tab ),
			array(
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
			__( 'Settings', 'wordpress-seo' )
		);

		return new WPSEO_Metabox_Tab_Section(
			'settings',
			'<span class="dashicons dashicons-admin-generic"></span>',
			array( $tab ),
			array(
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
		$options = WPSEO_Options::get_option( 'wpseo_social' );
		$taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );

		$tabs = array();
		if ( $options['opengraph'] === true ) {
			$facebook_meta_fields = $taxonomy_social_fields->get_by_network( 'opengraph' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'facebook',
				$this->taxonomy_tab_content->html( $facebook_meta_fields ),
				'<span class="dashicons dashicons-facebook-alt"></span>',
				array(
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
					'link_title' => __( 'Twitter metadata', 'wordpress-seo' ),
				)
			);
		}

		return new WPSEO_Metabox_Tab_Section(
			'social',
			'<span class="dashicons dashicons-share"></span>',
			$tabs,
			array(
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
	 * Return the SVG for the traffic light in the metabox.
	 */
	public function traffic_light_svg() {
		return <<<SVG
<svg class="yst-traffic-light init" version="1.1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
	 x="0px" y="0px" viewBox="0 0 30 47" enable-background="new 0 0 30 47" xml:space="preserve">
<g id="BG_1_">
</g>
<g id="traffic_light">
	<g>
		<g>
			<g>
				<path fill="#5B2942" d="M22,0H8C3.6,0,0,3.6,0,7.9v31.1C0,43.4,3.6,47,8,47h14c4.4,0,8-3.6,8-7.9V7.9C30,3.6,26.4,0,22,0z
					 M27.5,38.8c0,3.1-2.6,5.7-5.8,5.7H8.3c-3.2,0-5.8-2.5-5.8-5.7V8.3c0-1.5,0.6-2.9,1.7-4c1.1-1,2.5-1.6,4.1-1.6h13.4
					c1.5,0,3,0.6,4.1,1.6c1.1,1.1,1.7,2.5,1.7,4V38.8z"/>
			</g>
			<g class="traffic-light-color traffic-light-red">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#DC3232" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-orange">
				<ellipse fill="#F49A00" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-green">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#63B22B" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-empty">
				<ellipse fill="#C8C8C8" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#C8C8C8" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
			<g class="traffic-light-color traffic-light-init">
				<ellipse fill="#5B2942" cx="15" cy="23.5" rx="5.7" ry="5.6"/>
				<ellipse fill="#5B2942" cx="15" cy="10.9" rx="5.7" ry="5.6"/>
				<ellipse fill="#5B2942" cx="15" cy="36.1" rx="5.7" ry="5.6"/>
			</g>
		</g>
	</g>
</g>
</svg>
SVG;
	}

	/**
	 * Keyword tab for enabling analysis of multiple keywords.
	 */
	public function template_keyword_tab() {
		// This template belongs to the term scraper so don't echo it if it isn't enqueued.
		if ( ! wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper' ) ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-keyword_tab">
				<li class="wpseo_keyword_tab<# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_content" data-keyword="{{data.keyword}}" data-score="{{data.score}}">
						{{data.prefix}}
						<span class="wpseo-score-icon {{data.score}}">
							<span class="screen-reader-text"></span>
						</span>
						<em><span class="wpseo_keyword">{{data.placeholder}}</span></em>
					</a>
					<# if ( ! data.hideRemove ) { #>
						<a href="#" class="remove-keyword"><span>x</span></a>
					<# } #>
				</li>
			</script>';
	}
}
