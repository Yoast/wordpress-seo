<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class for managing feature toggles.
 */
class Yoast_Feature_Toggles {

	/**
	 * Available feature toggles.
	 *
	 * @var array
	 */
	protected $toggles;

	/**
	 * Instance holder.
	 *
	 * @var self|null
	 */
	protected static $instance = null;

	/**
	 * Gets the main feature toggles manager instance used.
	 *
	 * This essentially works like a Singleton, but for its drawbacks does not restrict
	 * instantiation otherwise.
	 *
	 * @return self Main instance.
	 */
	public static function instance() {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Gets all available feature toggles.
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	public function get_all() {
		if ( $this->toggles === null ) {
			$this->toggles = $this->load_toggles();
		}

		return $this->toggles;
	}

	/**
	 * Loads the available feature toggles.
	 *
	 * Also ensures that the toggles are all Yoast_Feature_Toggle instances and sorted by their order value.
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	protected function load_toggles() {
		$xml_sitemap_extra = false;
		if ( WPSEO_Options::get( 'enable_xml_sitemap' ) ) {
			$xml_sitemap_extra = '<a href="' . esc_url( WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ) )
				. '" target="_blank">' . esc_html__( 'See the XML sitemap.', 'wordpress-seo' ) . '</a>';
		}

		$feature_toggles = array(
			(object) array(
				'name'            => __( 'SEO analysis', 'wordpress-seo' ),
				'setting'         => 'keyword_analysis_active',
				'label'           => __( 'The SEO analysis offers suggestions to improve the SEO of your text.', 'wordpress-seo' ),
				'read_more_label' => __( 'Learn how the SEO analysis can help you rank.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2ak',
				'order'           => 10,
			),
			(object) array(
				'name'            => __( 'Readability analysis', 'wordpress-seo' ),
				'setting'         => 'content_analysis_active',
				'label'           => __( 'The readability analysis offers suggestions to improve the structure and style of your text.', 'wordpress-seo' ),
				'read_more_label' => __( 'Discover why readability is important for SEO.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2ao',
				'order'           => 20,
			),
			(object) array(
				'name'            => __( 'Cornerstone content', 'wordpress-seo' ),
				'setting'         => 'enable_cornerstone_content',
				'label'           => __( 'The cornerstone content feature lets you to mark and filter cornerstone content on your website.', 'wordpress-seo' ),
				'read_more_label' => __( 'Find out how cornerstone content can help you improve your site structure.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/dashboard-help-cornerstone',
				'order'           => 30,
			),
			(object) array(
				'name'            => __( 'Text link counter', 'wordpress-seo' ),
				'setting'         => 'enable_text_link_counter',
				'label'           => __( 'The text link counter helps you improve your site structure.', 'wordpress-seo' ),
				'read_more_label' => __( 'Find out how the text link counter can enhance your SEO.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2aj',
				'order'           => 40,
			),
			(object) array(
				'name'            => __( 'XML sitemaps', 'wordpress-seo' ),
				'setting'         => 'enable_xml_sitemap',
				/* translators: %s: Yoast SEO */
				'label'           => sprintf( __( 'Enable the XML sitemaps that %s generates.', 'wordpress-seo' ), 'Yoast SEO' ),
				'read_more_label' => __( 'Read why XML Sitemaps are important for your site.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2a-',
				'extra'           => $xml_sitemap_extra,
				'order'           => 60,
			),
			(object) array(
				/* translators: %s: Ryte */
				'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'Ryte' ),
				'setting'         => 'onpage_indexability',
				'label'           => sprintf(
					/* translators: 1: Ryte, 2: Yoast SEO */
					__( '%1$s will check weekly if your site is still indexable by search engines and %2$s will notify you when this is not the case.', 'wordpress-seo' ),
					'Ryte',
					'Yoast SEO'
				),
				/* translators: %s: Ryte */
				'read_more_label' => sprintf( __( 'Read more about how %s works.', 'wordpress-seo' ), 'Ryte ' ),
				'read_more_url'   => 'https://yoa.st/2an',
				'order'           => 70,
			),
			(object) array(
				'name'    => __( 'Admin bar menu', 'wordpress-seo' ),
				'setting' => 'enable_admin_bar_menu',
				/* translators: 1: Yoast SEO */
				'label'   => sprintf( __( 'The %1$s admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.', 'wordpress-seo' ), 'Yoast SEO' ),
				'order'   => 80,
			),
			(object) array(
				'name'    => __( 'Security: no advanced settings for authors', 'wordpress-seo' ),
				'setting' => 'disableadvanced_meta',
				'label'   => sprintf(
					/* translators: 1: Yoast SEO, 2: translated version of "Off" */
					__( 'The advanced section of the %1$s meta box allows a user to remove posts from the search results or change the canonical. These are things you might not want any author to do. That\'s why, by default, only editors and administrators can do this. Setting to "%2$s" allows all users to change these settings.', 'wordpress-seo' ),
					'Yoast SEO',
					__( 'Off', 'wordpress-seo' )
				),
				'order'   => 90,
			),
		);

		/**
		 * Filter to add feature toggles from add-ons.
		 *
		 * @param array $feature_toggles Array with feature toggle objects where each object
		 *                               should have a `name`, `setting` and `label` property.
		 */
		$feature_toggles = apply_filters( 'wpseo_feature_toggles', $feature_toggles );

		$feature_toggles = array_map( array( $this, 'ensure_toggle' ), $feature_toggles );
		usort( $feature_toggles, array( $this, 'sort_toggles_callback' ) );

		return $feature_toggles;
	}

	/**
	 * Ensures that the passed value is a Yoast_Feature_Toggle.
	 *
	 * @param Yoast_Feature_Toggle|object|array $toggle_data Feature toggle instance, or raw object or array
	 *                                                       containing feature toggle data.
	 * @return Yoast_Feature_Toggle Feature toggle instance based on $toggle_data.
	 */
	protected function ensure_toggle( $toggle_data ) {
		if ( $toggle_data instanceof Yoast_Feature_Toggle ) {
			return $toggle_data;
		}

		if ( is_object( $toggle_data ) ) {
			$toggle_data = get_object_vars( $toggle_data );
		}

		return new Yoast_Feature_Toggle( $toggle_data );
	}

	/**
	 * Callback for sorting feature toggles by their order.
	 *
	 * @param Yoast_Feature_Toggle $feature_a Feature A.
	 * @param Yoast_Feature_Toggle $feature_b Feature B.
	 *
	 * @return bool Whether order for feature A is bigger than for feature B.
	 */
	protected function sort_toggles_callback( Yoast_Feature_Toggle $feature_a, Yoast_Feature_Toggle $feature_b ) {
		return ( $feature_a->order > $feature_b->order );
	}
}
