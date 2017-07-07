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

		add_action( 'admin_footer', array( $this, 'template_generic_tab' ) );
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

		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );

		echo '<div class="inside">';

		$helpcenter_tab = new WPSEO_Option_Tab( 'tax-metabox', 'Meta box',
			array( 'video_url' => 'https://yoa.st/metabox-taxonomy-screencast' ) );

		$helpcenter = new WPSEO_Help_Center( 'tax-metabox', $helpcenter_tab );
		$helpcenter->output_help_center();

		echo '<div id="taxonomy_overall"></div>';

		if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) {
			echo $this->get_buy_premium_link();
		}

		echo '<div class="wpseo-metabox-sidebar"><ul>';

		foreach ( $content_sections as $content_section ) {
			if ( $content_section->name === 'premium' ) {
				continue;
			}

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
			$this->get_social_meta_section(),
			$this->get_settings_meta_section(),
		);

		if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) {
			$content_sections[] = $this->get_buy_premium_section();
		}

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
			'',
			array(
				'tab_class' => 'yoast-seo__remove-tab',
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'content',
			'<span class="screen-reader-text">' . __( 'Content optimization', 'wordpress-seo' ) . '</span><span class="yst-traffic-light-container">' . $this->traffic_light_svg() . '</span>',
			array( $tab ),
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
		$content = $this->taxonomy_tab_content->html( $taxonomy_settings_fields->get() );

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
		$options = WPSEO_Options::get_option( 'wpseo_social' );
		$taxonomy_social_fields = new WPSEO_Taxonomy_Social_Fields( $this->term );
		$social_admin = new WPSEO_Social_Admin;

		$tabs = array();
		$single = true;

		if ( $options['opengraph'] === true && $options['twitter'] === true ) {
			$single = null;
		}

		if ( $options['opengraph'] === true ) {
			$facebook_meta_fields = $taxonomy_social_fields->get_by_network( 'opengraph' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'facebook',
				$social_admin->get_premium_notice( 'opengraph' ) . $this->taxonomy_tab_content->html( $facebook_meta_fields ),
				'<span class="screen-reader-text">' . __( 'Facebook / Open Graph metadata', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-facebook-alt"></span>',
				array(
					'link_aria_label' => __( 'Facebook / Open Graph metadata', 'wordpress-seo' ),
					'link_class'      => 'yoast-tooltip yoast-tooltip-se',
					'single'          => $single,
				)
			);
		}

		if ( $options['twitter'] === true ) {
			$twitter_meta_fields = $taxonomy_social_fields->get_by_network( 'twitter' );

			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'twitter',
				$social_admin->get_premium_notice( 'twitter' ) . $this->taxonomy_tab_content->html( $twitter_meta_fields ),
				'<span class="screen-reader-text">' . __( 'Twitter metadata', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-twitter"></span>',
				array(
					'link_aria_label' => __( 'Twitter metadata', 'wordpress-seo' ),
					'link_class'      => 'yoast-tooltip yoast-tooltip-se',
					'single'          => $single,
				)
			);
		}

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
	 * Returns a link to activate the Buy Premium tab.
	 *
	 * @return string
	 */
	private function get_buy_premium_link() {
		return sprintf( "<div class='%s'><a href='#wpseo-meta-section-premium' class='wpseo-meta-section-link'><span class='dashicons dashicons-star-filled wpseo-buy-premium'></span>%s</a></div>",
			'wpseo-metabox-buy-premium',
			__( 'Go Premium', 'wordpress-seo' )
		);
	}

	/**
	 * Returns the metabox section for the Premium section..
	 *
	 * @return WPSEO_Metabox_Section
	 */
	private function get_buy_premium_section() {
		$content = sprintf( "<div class='wpseo-metabox-premium-description'>
			%s
			<ul class='wpseo-metabox-premium-advantages'>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
				<li>
					<strong>%s</strong> - %s
				</li>
			</ul>

			<a target='_blank' id='wpseo-buy-premium-popup-button' class='button button-buy-premium wpseo-metabox-go-to' href='%s'>
				%s
			</a>

			<p><a target='_blank' class='wpseo-metabox-go-to' href='%s'>%s</a></p>
		</div>",
			/* translators: %1$s expands to Yoast SEO Premium. */
			sprintf( __( 'You\'re not getting the benefits of %1$s yet. If you had %1$s, you could use its awesome features:', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			__( 'Redirect manager', 'wordpress-seo' ),
			__( 'Create and manage redirects within your WordPress install.', 'wordpress-seo' ),
			__( 'Multiple focus keywords', 'wordpress-seo' ),
			__( 'Optimize a single post for up to 5 keywords.', 'wordpress-seo' ),
			__( 'Social Previews', 'wordpress-seo' ),
			__( 'Check what your Facebook or Twitter post will look like.', 'wordpress-seo' ),
			__( 'Premium support', 'wordpress-seo' ),
			__( 'Gain access to our 24/7 support team.', 'wordpress-seo' ),
			WPSEO_Shortlinker::get( 'https://yoa.st/pe-buy-premium' ),
			/* translators: %s expands to Yoast SEO Premium. */
			sprintf( __( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium' ),
			WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
			__( 'More info', 'wordpress-seo' )
		);

		$tab = new WPSEO_Metabox_Form_Tab(
			'premium',
			$content,
			'Yoast SEO Premium',
			array(
				'single' => true,
			)
		);

		return new WPSEO_Metabox_Tab_Section(
			'premium',
			'<span class="dashicons dashicons-star-filled wpseo-buy-premium"></span>',
			array( $tab ),
			array(
				'link_aria_label' => 'Yoast SEO Premium',
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
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
	 * Generic tab.
	 */
	public function template_generic_tab() {
		// This template belongs to the post scraper so don't echo it if it isn't enqueued.
		if ( ! wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper' ) ) {
			return;
		}

		echo '<script type="text/html" id="tmpl-generic_tab">
				<li class="<# if ( data.classes ) { #>{{data.classes}}<# } #><# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_generic" data-score="{{data.score}}">
						<span class="wpseo-score-icon {{data.score}}"></span>
						<span class="wpseo-tab-prefix">{{data.prefix}}</span>
						<span class="wpseo-tab-label">{{data.label}}</span>
						<span class="screen-reader-text wpseo-generic-tab-textual-score">{{data.scoreText}}</span>
					</a>
					<# if ( data.hideable ) { #>
						<button type="button" class="remove-tab" aria-label="{{data.removeLabel}}"><span>x</span></button>
					<# } #>
				</li>
			</script>';
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
				<li class="<# if ( data.classes ) { #>{{data.classes}}<# } #><# if ( data.active ) { #> active<# } #>">
					<a class="wpseo_tablink" href="#wpseo_content" data-keyword="{{data.keyword}}" data-score="{{data.score}}">
						<span class="wpseo-score-icon {{data.score}}"></span>
						<span class="wpseo-tab-prefix">{{data.prefix}}</span>
						<em class="wpseo-keyword">{{data.label}}</em>
						<span class="screen-reader-text wpseo-keyword-tab-textual-score">{{data.scoreText}}</span>
					</a>
					<# if ( data.hideable ) { #>
						<button type="button" class="remove-keyword" aria-label="{{data.removeLabel}}"><span>x</span></button>
					<# } #>
				</li>
			</script>';
	}
}
