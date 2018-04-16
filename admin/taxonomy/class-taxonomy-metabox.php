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

		add_action( 'admin_footer', array( $this, 'template_generic_tab' ) );
		add_action( 'admin_footer', array( $this, 'template_keyword_tab' ) );
	}

	/**
	 * Shows the Yoast SEO metabox for the term.
	 */
	public function display() {

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'help-center' );

		$content_sections = $this->get_content_sections();

		$product_title = 'Yoast SEO';
		if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
			$product_title .= ' Premium';
		}

		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );

		echo '<div class="inside">';

		$helpcenter_tab = new WPSEO_Option_Tab( 'tax-metabox', __( 'Meta box', 'wordpress-seo' ),
			array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/metabox-taxonomy-screencast' ) ) );

		$helpcenter = new WPSEO_Help_Center( 'tax-metabox', $helpcenter_tab, WPSEO_Utils::is_yoast_seo_premium() );
		$helpcenter->localize_data();
		$helpcenter->mount();

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
		$content                 = $this->taxonomy_tab_content->html( $taxonomy_content_fields->get( $this->term ) );

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
			'<span class="screen-reader-text">' . __( 'Content optimization', 'wordpress-seo' ) . '</span><span class="yst-traffic-light-container">' . WPSEO_Utils::traffic_light_svg() . '</span>',
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
		$content = sprintf( "<div class='wpseo-premium-description'>
			%s
			<ul class='wpseo-premium-advantages-list'>
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
