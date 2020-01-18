<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class that handles the edit boxes on taxonomy edit pages.
 */
class WPSEO_Taxonomy {

	/**
	 * The current active taxonomy.
	 *
	 * @var string
	 */
	private $taxonomy = '';

	/**
	 * Holds the metabox SEO analysis instance.
	 *
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	private $analysis_seo;

	/**
	 * Holds the metabox readability analysis instance.
	 *
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	private $analysis_readability;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->taxonomy = $this->get_taxonomy();

		add_action( 'edit_term', [ $this, 'update_term' ], 99, 3 );
		add_action( 'init', [ $this, 'custom_category_descriptions_allow_html' ] );
		add_action( 'admin_init', [ $this, 'admin_init' ] );

		if ( self::is_term_overview( $GLOBALS['pagenow'] ) ) {
			new WPSEO_Taxonomy_Columns();
		}
		$this->analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$this->analysis_readability = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Add hooks late enough for taxonomy object to be available for checks.
	 */
	public function admin_init() {

		$taxonomy = get_taxonomy( $this->taxonomy );

		if ( empty( $taxonomy ) || empty( $taxonomy->public ) || ! $this->show_metabox() ) {
			return;
		}

		$this->insert_description_field_editor();

		add_action( sanitize_text_field( $this->taxonomy ) . '_edit_form', [ $this, 'term_metabox' ], 90, 1 );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
	}

	/**
	 * Show the SEO inputs for term.
	 *
	 * @param stdClass|WP_Term $term Term to show the edit boxes for.
	 */
	public function term_metabox( $term ) {
		if ( WPSEO_Metabox::is_internet_explorer() ) {
			$this->show_internet_explorer_notice();
			return;
		}

		$metabox = new WPSEO_Taxonomy_Metabox( $this->taxonomy, $term );
		$metabox->display();
	}

	/**
	 * Renders the content for the internet explorer metabox.
	 */
	private function show_internet_explorer_notice() {
		$product_title = 'Yoast SEO';
		if ( file_exists( WPSEO_PATH . 'premium/' ) ) {
			$product_title .= ' Premium';
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $product_title is hardcoded.
		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );

		echo '<div class="inside">';
		echo '<div class="yoast-alert-box yoast-alert-box__warning">';
		echo '<span class="icon">';
		echo '<svg xmlns="http://www.w3.org/2000/svg" fill="#674E00" height="14px" width="14px" viewBox="0 0 576 512" role="img" aria-hidden="true" focusable="false"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/></svg>';
		echo '</span>';
		echo '<div style="float: left">';
		printf(
			/* translators: 1: link to Firefox website; 2: link to Chrome website; 3: link to Edge website; 4: link close tag. */
			esc_html__( 'The browser you are currently using is unfortunately rather dated. Since we strive to give you the best experience possible, we no longer support this browser. Instead, please use %1$sFirefox%4$s, %2$sChrome%4$s or %3$sMicrosoft Edge%4$s.', 'wordpress-seo' ),
			'<a href="https://www.mozilla.org/firefox/new/">',
			'<a href="https://www.google.com/intl/nl/chrome/">',
			'<a href="https://www.microsoft.com/windows/microsoft-edge">',
			'</a>'
		);
		echo '</div></div>';
		echo '</div></div>';
	}

	/**
	 * Queue assets for taxonomy screens.
	 *
	 * @since 1.5.0
	 */
	public function admin_enqueue_scripts() {

		$pagenow = $GLOBALS['pagenow'];

		if ( ! ( self::is_term_edit( $pagenow ) || self::is_term_overview( $pagenow ) ) ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'scoring' );

		$tag_id = filter_input( INPUT_GET, 'tag_ID' );
		if (
			self::is_term_edit( $pagenow ) &&
			! empty( $tag_id )  // After we drop support for <4.5 this can be removed.
		) {
			wp_enqueue_media(); // Enqueue files needed for upload functionality.

			$asset_manager->enqueue_style( 'metabox-css' );
			$asset_manager->enqueue_style( 'scoring' );
			$asset_manager->enqueue_script( 'metabox' );
			$asset_manager->enqueue_script( 'term-scraper' );
			$asset_manager->enqueue_script( 'admin-script' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper', 'wpseoTermScraperL10n', $this->localize_term_scraper_script() );
			$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
			$yoast_components_l10n->localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper' );

			$analysis_worker_location          = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ) );
			$used_keywords_assessment_location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ), 'used-keywords-assessment' );

			$localization_data = [
				'url'                     => $analysis_worker_location->get_url(
					$analysis_worker_location->get_asset(),
					WPSEO_Admin_Asset::TYPE_JS
				),
				'keywords_assessment_url' => $used_keywords_assessment_location->get_url(
					$used_keywords_assessment_location->get_asset(),
					WPSEO_Admin_Asset::TYPE_JS
				),
				'log_level'               => WPSEO_Utils::get_analysis_worker_log_level(),
			];
			wp_localize_script(
				WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper',
				'wpseoAnalysisWorkerL10n',
				$localization_data
			);

			/**
			 * Remove the emoji script as it is incompatible with both React and any
			 * contenteditable fields.
			 */
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'replacevar-plugin', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoSelect2Locale', WPSEO_Language_Utils::get_language( WPSEO_Language_Utils::get_user_locale() ) );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoAdminL10n', WPSEO_Utils::get_admin_l10n() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoFeaturesL10n', WPSEO_Utils::retrieve_enabled_features() );

			$asset_manager->enqueue_script( 'admin-media' );

			wp_localize_script(
				WPSEO_Admin_Asset_Manager::PREFIX . 'admin-media',
				'wpseoMediaL10n',
				[ 'choose_image' => __( 'Use Image', 'wordpress-seo' ) ]
			);
		}

		if ( self::is_term_overview( $pagenow ) ) {
			$asset_manager->enqueue_script( 'edit-page-script' );
		}
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id  ID of the term to save data for.
	 * @param int    $tt_id    The taxonomy_term_id for the term.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 */
	public function update_term( $term_id, $tt_id, $taxonomy ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return;
		}

		/* Create post array with only our values. */
		$new_meta_data = [];
		foreach ( WPSEO_Taxonomy_Meta::$defaults_per_term as $key => $default ) {
			$posted_value = filter_input( INPUT_POST, $key );
			if ( isset( $posted_value ) && $posted_value !== false ) {
				$new_meta_data[ $key ] = $posted_value;
			}

			// If analysis is disabled remove that analysis score value from the DB.
			if ( $this->is_meta_value_disabled( $key ) ) {
				$new_meta_data[ $key ] = '';
			}
		}
		unset( $key, $default );

		// Saving the values.
		WPSEO_Taxonomy_Meta::set_values( $term_id, $taxonomy, $new_meta_data );
	}

	/**
	 * Determines if the given meta value key is disabled.
	 *
	 * @param string $key The key of the meta value.
	 * @return bool Whether the given meta value key is disabled.
	 */
	public function is_meta_value_disabled( $key ) {
		if ( $key === 'wpseo_linkdex' && ! $this->analysis_seo->is_enabled() ) {
			return true;
		}

		if ( $key === 'wpseo_content_score' && ! $this->analysis_readability->is_enabled() ) {
			return true;
		}

		return false;
	}

	/**
	 * Allows HTML in descriptions.
	 */
	public function custom_category_descriptions_allow_html() {
		$filters = [
			'pre_term_description',
			'pre_link_description',
			'pre_link_notes',
			'pre_user_description',
		];

		foreach ( $filters as $filter ) {
			remove_filter( $filter, 'wp_filter_kses' );
			if ( ! current_user_can( 'unfiltered_html' ) ) {
				add_filter( $filter, 'wp_filter_post_kses' );
			}
		}
		remove_filter( 'term_description', 'wp_kses_data' );
	}

	/**
	 * Output the WordPress editor.
	 */
	public function custom_category_description_editor() {
		wp_editor( '', 'description' );
	}

	/**
	 * Pass variables to js for use with the term-scraper.
	 *
	 * @return array
	 */
	public function localize_term_scraper_script() {
		$term_id  = filter_input( INPUT_GET, 'tag_ID' );
		$term     = get_term_by( 'id', $term_id, $this->get_taxonomy() );
		$taxonomy = get_taxonomy( $term->taxonomy );

		$term_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Term_Metabox_Formatter( $taxonomy, $term )
		);

		return $term_formatter->get_values();
	}

	/**
	 * Pass some variables to js for replacing variables.
	 */
	public function localize_replace_vars_script() {
		return [
			'no_parent_text'           => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'             => $this->get_replace_vars(),
			'recommended_replace_vars' => $this->get_recommended_replace_vars(),
			'scope'                    => $this->determine_scope(),
		];
	}

	/**
	 * Determines the scope based on the current taxonomy.
	 * This can be used by the replacevar plugin to determine if a replacement needs to be executed.
	 *
	 * @return string String decribing the current scope.
	 */
	private function determine_scope() {
		$taxonomy = $this->get_taxonomy();

		if ( $taxonomy === 'category' ) {
			return 'category';
		}

		if ( $taxonomy === 'post_tag' ) {
			return 'tag';
		}

		return 'term';
	}

	/**
	 * Determines if a given page is the term overview page.
	 *
	 * @param string $page The string to check for the term overview page.
	 *
	 * @return bool
	 */
	public static function is_term_overview( $page ) {
		return $page === 'edit-tags.php';
	}

	/**
	 * Determines if a given page is the term edit page.
	 *
	 * @param string $page The string to check for the term edit page.
	 *
	 * @return bool
	 */
	public static function is_term_edit( $page ) {
		return $page === 'term.php';
	}

	/**
	 * Retrieves a template.
	 * Check if metabox for current taxonomy should be displayed.
	 *
	 * @return bool
	 */
	private function show_metabox() {
		$option_key = 'display-metabox-tax-' . $this->taxonomy;

		return WPSEO_Options::get( $option_key );
	}

	/**
	 * Getting the taxonomy from the URL.
	 *
	 * @return string
	 */
	private function get_taxonomy() {
		return filter_input( INPUT_GET, 'taxonomy', FILTER_DEFAULT, [ 'options' => [ 'default' => '' ] ] );
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @return array The replacement variables.
	 */
	private function get_replace_vars() {
		$term_id = filter_input( INPUT_GET, 'tag_ID' );
		$term    = get_term_by( 'id', $term_id, $this->get_taxonomy() );

		$cached_replacement_vars = [];

		$vars_to_cache = [
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'term_title',
			'term_description',
			'category_description',
			'tag_description',
			'searchphrase',
			'currentyear',
		];

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = wpseo_replace_vars( '%%' . $var . '%%', $term );
		}

		return $cached_replacement_vars;
	}

	/**
	 * Prepares the recommended replace vars for localization.
	 *
	 * @return array The recommended replacement variables.
	 */
	private function get_recommended_replace_vars() {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
		$taxonomy                 = filter_input( INPUT_GET, 'taxonomy' );

		// What is recommended depends on the current context.
		$page_type = $recommended_replace_vars->determine_for_term( $taxonomy );

		return $recommended_replace_vars->get_recommended_replacevars_for( $page_type );
	}

	/**
	 * Adds custom category description editor.
	 * Needs a hook that runs before the description field. Prior to WP version 4.5 we need to use edit_form as
	 * term_edit_form_top was introduced in WP 4.5. This can be removed after <4.5 is no longer supported.
	 *
	 * @return {void}
	 */
	private function insert_description_field_editor() {
		if ( version_compare( $GLOBALS['wp_version'], '4.5', '<' ) ) {
			add_action( "{$this->taxonomy}_edit_form", [ $this, 'custom_category_description_editor' ] );
			return;
		}

		add_action( "{$this->taxonomy}_term_edit_form_top", [ $this, 'custom_category_description_editor' ] );
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Adds shortcode support to category descriptions.
	 *
	 * @deprecated 7.9.0
	 * @codeCoverageIgnore
	 *
	 * @param string $desc String to add shortcodes in.
	 *
	 * @return string Content with shortcodes filtered out.
	 */
	public function custom_category_descriptions_add_shortcode_support( $desc ) {
		_deprecated_function( __FUNCTION__, 'WPSEO 7.9.0', 'WPSEO_Frontend::custom_category_descriptions_add_shortcode_support' );

		$frontend = WPSEO_Frontend::get_instance();
		return $frontend->custom_category_descriptions_add_shortcode_support( $desc );
	}
}
