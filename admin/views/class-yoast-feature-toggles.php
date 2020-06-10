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

		$feature_toggles = [
			(object) [
				'name'            => __( 'SEO analysis', 'wordpress-seo' ),
				'setting'         => 'keyword_analysis_active',
				'read_more_label' => __( 'Learn how the SEO analysis can help you rank.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2ak',
				'order'           => 10,
			],
			(object) [
				'name'            => __( 'Readability analysis', 'wordpress-seo' ),
				'setting'         => 'content_analysis_active',
				'read_more_label' => __( 'Discover why readability is important for SEO.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2ao',
				'order'           => 20,
			],
			(object) [
				'name'            => __( 'Cornerstone content', 'wordpress-seo' ),
				'setting'         => 'enable_cornerstone_content',
				'read_more_label' => __( 'Find out how cornerstone content can help you improve your site structure.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/dashboard-help-cornerstone',
				'order'           => 30,
			],
			(object) [
				'name'            => __( 'Text link counter', 'wordpress-seo' ),
				'setting'         => 'enable_text_link_counter',
				'read_more_label' => __( 'Find out how the text link counter can enhance your SEO.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2aj',
				'order'           => 40,
			],
			(object) [
				'name'            => __( 'XML sitemaps', 'wordpress-seo' ),
				'setting'         => 'enable_xml_sitemap',
				'read_more_label' => __( 'Read why XML Sitemaps are important for your site.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/2a-',
				'extra'           => $xml_sitemap_extra,
				'order'           => 60,
			],
			(object) [
				/* translators: %s: Ryte */
				'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'Ryte' ),
				'setting'         => 'ryte_indexability',
				/* translators: %s: Ryte */
				'read_more_label' => sprintf( __( 'Read more about how %s works.', 'wordpress-seo' ), 'Ryte ' ),
				'read_more_url'   => 'https://yoa.st/2an',
				'order'           => 70,
			],
			(object) [
				'name'            => __( 'Admin bar menu', 'wordpress-seo' ),
				'setting'         => 'enable_admin_bar_menu',
				'read_more_label' => __( 'Read more about the use of the admin bar menu.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/40q',
				'order'           => 80,
			],
			(object) [
				'name'            => __( 'Security: no advanced settings for authors', 'wordpress-seo' ),
				'setting'         => 'disableadvanced_meta',
				'read_more_label' => __( 'Read more about this security setting.', 'wordpress-seo' ),
				'read_more_url'   => 'https://yoa.st/40r',
				'order'           => 90,
			],
			(object) [
				'name'    => __( 'REST API: Head endpoint', 'wordpress-seo' ),
				'setting' => 'enable_headless_rest_endpoints',
				'read_more_label' => sprintf(
					/* translators: 1: Yoast SEO */
					__( 'This %1$s REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use %1$s for all their SEO meta output.', 'wordpress-seo' ),
					'Yoast SEO'
				),
				'read_more_url'   => 'https://example.com',// @todo add a URL once this article has been written.
				'order'   => 100,
			],
		];

		/**
		 * Filter to add feature toggles from add-ons.
		 *
		 * @param array $feature_toggles Array with feature toggle objects where each object
		 *                               should have a `name`, `setting` and `label` property.
		 */
		$feature_toggles = apply_filters( 'wpseo_feature_toggles', $feature_toggles );

		$feature_toggles = array_map( [ $this, 'ensure_toggle' ], $feature_toggles );
		usort( $feature_toggles, [ $this, 'sort_toggles_callback' ] );

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
