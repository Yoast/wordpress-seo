<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

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
	 *
	 * @return void
	 */
	private function show_internet_explorer_notice() {
		$product_title = YoastSEO()->helpers->product->get_product_name();

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $product_title is hardcoded.
		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $product_title );
		echo '<div class="inside">';

		$content = sprintf(
			/* translators: 1: Link start tag to the Firefox website, 2: Link start tag to the Chrome website, 3: Link start tag to the Edge website, 4: Link closing tag. */
			esc_html__( 'The browser you are currently using is unfortunately rather dated. Since we strive to give you the best experience possible, we no longer support this browser. Instead, please use %1$sFirefox%4$s, %2$sChrome%4$s or %3$sMicrosoft Edge%4$s.', 'wordpress-seo' ),
			'<a href="https://www.mozilla.org/firefox/new/">',
			'<a href="https://www.google.com/chrome/">',
			'<a href="https://www.microsoft.com/windows/microsoft-edge">',
			'</a>'
		);
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output escaped above.
		echo new Alert_Presenter( $content );

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
		$asset_manager->enqueue_style( 'monorepo' );

		$tag_id = filter_input( INPUT_GET, 'tag_ID' );
		if (
			self::is_term_edit( $pagenow )
			&& ! empty( $tag_id )  // After we drop support for <4.5 this can be removed.
		) {
			wp_enqueue_media(); // Enqueue files needed for upload functionality.

			$asset_manager->enqueue_style( 'metabox-css' );
			$asset_manager->enqueue_style( 'scoring' );
			$asset_manager->enqueue_script( 'term-edit' );

			$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
			$yoast_components_l10n->localize_script( 'term-edit' );

			$analysis_worker_location          = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ) );
			$used_keywords_assessment_location = new WPSEO_Admin_Asset_Analysis_Worker_Location( $asset_manager->flatten_version( WPSEO_VERSION ), 'used-keywords-assessment' );

			/**
			 * Remove the emoji script as it is incompatible with both React and any
			 * contenteditable fields.
			 */
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

			$asset_manager->localize_script( 'term-edit', 'wpseoAdminL10n', WPSEO_Utils::get_admin_l10n() );
			$asset_manager->localize_script( 'term-edit', 'wpseoFeaturesL10n', WPSEO_Utils::retrieve_enabled_features() );

			$script_data = [
				'analysis'         => [
					'plugins' => [
						'replaceVars' => [
							'no_parent_text'           => __( '(no parent)', 'wordpress-seo' ),
							'replace_vars'             => $this->get_replace_vars(),
							'recommended_replace_vars' => $this->get_recommended_replace_vars(),
							'scope'                    => $this->determine_scope(),
						],
					],
					'worker'  => [
						'url'                     => $analysis_worker_location->get_url(
							$analysis_worker_location->get_asset(),
							WPSEO_Admin_Asset::TYPE_JS
						),
						'keywords_assessment_url' => $used_keywords_assessment_location->get_url(
							$used_keywords_assessment_location->get_asset(),
							WPSEO_Admin_Asset::TYPE_JS
						),
						'log_level'               => WPSEO_Utils::get_analysis_worker_log_level(),
					],
				],
				'media'            => [
					// @todo replace this translation with JavaScript translations.
					'choose_image' => __( 'Use Image', 'wordpress-seo' ),
				],
				'metabox'          => $this->localize_term_scraper_script(),
				'userLanguageCode' => WPSEO_Language_Utils::get_language( \get_user_locale() ),
				'isTerm'           => true,
			];
			$asset_manager->localize_script( 'term-edit', 'wpseoScriptData', $script_data );
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
	 * Allows post-kses-filtered HTML in term descriptions.
	 */
	public function custom_category_descriptions_allow_html() {
		remove_filter( 'term_description', 'wp_kses_data' );
		remove_filter( 'pre_term_description', 'wp_filter_kses' );
		add_filter( 'term_description', 'wp_kses_post' );
		add_filter( 'pre_term_description', 'wp_filter_post_kses' );
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
	 * Function to get the labels for the current taxonomy.
	 *
	 * @return object Labels for the current taxonomy.
	 */
	public static function get_labels() {
		$term     = filter_input( INPUT_GET, 'taxonomy', FILTER_DEFAULT, [ 'options' => [ 'default' => '' ] ] );
		$taxonomy = get_taxonomy( $term );

		return $taxonomy->labels;
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
			'term_hierarchy',
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
}
