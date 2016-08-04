<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class that handles the edit boxes on taxonomy edit pages.
 */
class WPSEO_Taxonomy {

	/**
	 * The current active taxonomy
	 *
	 * @var string
	 */
	private $taxonomy = '';

	/**
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	private $analysis_seo;

	/**
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	private $analysis_readability;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->taxonomy = $this->get_taxonomy();

		add_action( 'edit_term', array( $this, 'update_term' ), 99, 3 );
		add_action( 'init', array( $this, 'custom_category_descriptions_allow_html' ) );
		add_action( 'admin_init', array( $this, 'admin_init' ) );
		// Needs a hook that runs before the description field.
		add_action( "{$this->taxonomy}_term_edit_form_top", array( $this, 'custom_category_description_editor' ) );
		add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );

		if ( self::is_term_overview( $GLOBALS['pagenow'] ) ) {
			new WPSEO_Taxonomy_Columns();
		}

		$this->analysis_seo = new WPSEO_Metabox_Analysis_SEO();
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

		add_action( sanitize_text_field( $this->taxonomy ) . '_edit_form', array( $this, 'term_metabox' ), 90, 1 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Show the SEO inputs for term.
	 *
	 * @param stdClass|WP_Term $term Term to show the edit boxes for.
	 */
	public function term_metabox( $term ) {
		$metabox = new WPSEO_Taxonomy_Metabox( $this->taxonomy, $term );
		$metabox->display();
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
			$asset_manager->enqueue_style( 'snippet' );
			$asset_manager->enqueue_style( 'scoring' );
			$asset_manager->enqueue_script( 'metabox' );
			$asset_manager->enqueue_script( 'term-scraper' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper', 'wpseoTermScraperL10n', $this->localize_term_scraper_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'replacevar-plugin', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'wpseoSelect2Locale', WPSEO_Utils::get_language( get_locale() ) );

			$asset_manager->enqueue_script( 'admin-media' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-media', 'wpseoMediaL10n', array(
				'choose_image' => __( 'Use Image', 'wordpress-seo' ),
			) );
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
		/* Create post array with only our values */
		$new_meta_data = array();
		foreach ( WPSEO_Taxonomy_Meta::$defaults_per_term as $key => $default ) {
			if ( $posted_value = filter_input( INPUT_POST, $key ) ) {
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
	 * Determines if the given meta value key is disabled
	 *
	 * @param string $key The key of the meta value.
	 * @return bool Whether the given meta value key is disabled.
	 */
	public function is_meta_value_disabled( $key ) {
		if ( 'wpseo_linkdex' === $key && ! $this->analysis_seo->is_enabled() ) {
			return true;
		}

		if ( 'wpseo_content_score' === $key && ! $this->analysis_readability->is_enabled() ) {
			return true;
		}

		return false;
	}

	/**
	 * Allows HTML in descriptions
	 */
	public function custom_category_descriptions_allow_html() {
		$filters = array(
			'pre_term_description',
			'pre_link_description',
			'pre_link_notes',
			'pre_user_description',
		);

		foreach ( $filters as $filter ) {
			remove_filter( $filter, 'wp_filter_kses' );
		}
		remove_filter( 'term_description', 'wp_kses_data' );
	}

	/**
	 * Output the WordPress editor.
	 */
	public function custom_category_description_editor() {

		if ( ! $this->show_metabox() ) {
			return;
		}

		wp_editor( '', 'description' );
	}

	/**
	 * Adds shortcode support to category descriptions.
	 *
	 * @param string $desc String to add shortcodes in.
	 *
	 * @return string
	 */
	public function custom_category_descriptions_add_shortcode_support( $desc ) {
		// Wrap in output buffering to prevent shortcodes that echo stuff instead of return from breaking things.
		ob_start();
		$desc = do_shortcode( $desc );
		ob_end_clean();

		return $desc;
	}

	/**
	 * Pass variables to js for use with the term-scraper
	 *
	 * @return array
	 */
	public function localize_term_scraper_script() {
		$term_id  = filter_input( INPUT_GET, 'tag_ID' );
		$term     = get_term_by( 'id', $term_id, $this->get_taxonomy() );
		$taxonomy = get_taxonomy( $term->taxonomy );

		$term_formatter = new WPSEO_Metabox_Formatter(
			new WPSEO_Term_Metabox_Formatter( $taxonomy, $term, WPSEO_Options::get_option( 'wpseo_titles' ) )
		);

		return $term_formatter->get_values();
	}

	/**
	 * Pass some variables to js for replacing variables.
	 */
	public function localize_replace_vars_script() {
		return array(
			'no_parent_text' => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'   => $this->get_replace_vars(),
			'scope'          => $this->determine_scope(),
		);
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
	 * @param string $page The string to check for the term overview page.
	 *
	 * @return bool
	 */
	public static function is_term_overview( $page ) {
		return 'edit-tags.php' === $page;
	}

	/**
	 * @param string $page The string to check for the term edit page.
	 *
	 * @return bool
	 */
	public static function is_term_edit( $page ) {
		return 'term.php' === $page
		       || 'edit-tags.php' === $page; // After we drop support for <4.5 this can be removed.
	}

	/**
	 * Retrieves a template.
	 * Check if metabox for current taxonomy should be displayed.
	 *
	 * @return bool
	 */
	private function show_metabox() {
		$options    = WPSEO_Options::get_option( 'wpseo_titles' );
		$option_key = 'hideeditbox-tax-' . $this->taxonomy;

		return ( empty( $options[ $option_key ] ) );
	}

	/**
	 * Getting the taxonomy from the URL
	 *
	 * @return string
	 */
	private function get_taxonomy() {
		return filter_input( INPUT_GET, 'taxonomy', FILTER_DEFAULT, array( 'options' => array( 'default' => '' ) ) );
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @return array replace vars.
	 */
	private function get_replace_vars() {
		$term_id = filter_input( INPUT_GET, 'tag_ID' );
		$term  = get_term_by( 'id', $term_id, $this->get_taxonomy() );
		$cached_replacement_vars = array();

		$vars_to_cache = array(
			'date',
			'id',
			'sitename',
			'sitedesc',
			'sep',
			'page',
			'currenttime',
			'currentdate',
			'currentday',
			'currentmonth',
			'currentyear',
			'term_title',
			'term_description',
			'category_description',
			'tag_description',
			'searchphrase',
		);

		foreach ( $vars_to_cache as $var ) {
			$cached_replacement_vars[ $var ] = wpseo_replace_vars( '%%' . $var . '%%', $term );
		}

		return $cached_replacement_vars;
	}

	/********************** DEPRECATED METHODS **********************/

	/**
	 * @deprecated 3.2
	 *
	 * Retrieves the title template.
	 *
	 * @param object $term taxonomy term.
	 *
	 * @return string
	 */
	public static function get_title_template( $term ) {
		_deprecated_function( 'WPSEO_Taxonomy::get_title_template', 'WPSEO 3.2', 'WPSEO_Term_Scraper::get_title_template' );

		return '';
	}

	/**
	 * @deprecated 3.2
	 *
	 * Retrieves the metadesc template.
	 *
	 * @param object $term taxonomy term.
	 *
	 * @return string
	 */
	public static function get_metadesc_template( $term ) {
		_deprecated_function( 'WPSEO_Taxonomy::get_metadesc_template', 'WPSEO 3.2', 'WPSEO_Term_Scraper::get_metadesc_template' );

		return '';
	}

	/**
	 * @deprecated 3.2
	 *
	 * Translate options text strings for use in the select fields
	 *
	 * @internal IMPORTANT: if you want to add a new string (option) somewhere, make sure you add
	 * that array key to the main options definition array in the class WPSEO_Taxonomy_Meta() as well!!!!
	 */
	public function translate_meta_options() {
		_deprecated_function( 'WPSEO_Taxonomy::translate_meta_options', 'WPSEO 3.2', 'WPSEO_Taxonomy_Settings_Fields::translate_meta_options' );
	}
}
