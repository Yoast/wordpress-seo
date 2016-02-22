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
	 * Class constructor
	 */
	public function __construct() {
		$this->taxonomy = $this->get_taxonomy();

		if ( is_admin() && $this->taxonomy !== '' && $this->show_metabox() ) {
			add_action( sanitize_text_field( $this->taxonomy ) . '_edit_form', array( $this, 'term_metabox' ), 90, 1 );
		}

		add_action( 'edit_term', array( $this, 'update_term' ), 99, 3 );

		add_action( 'init', array( $this, 'custom_category_descriptions_allow_html' ) );
		add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		if ( $GLOBALS['pagenow'] === 'edit-tags.php' ) {
			new WPSEO_Taxonomy_Columns();
		}

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
	 * Translate options text strings for use in the select fields
	 *
	 * @internal IMPORTANT: if you want to add a new string (option) somewhere, make sure you add
	 * that array key to the main options definition array in the class WPSEO_Taxonomy_Meta() as well!!!!
	 */
	public function translate_meta_options() {
		$this->no_index_options        = WPSEO_Taxonomy_Meta::$no_index_options;
		$this->sitemap_include_options = WPSEO_Taxonomy_Meta::$sitemap_include_options;

		$this->no_index_options['default'] = __( 'Use %s default (Currently: %s)', 'wordpress-seo' );
		$this->no_index_options['index']   = __( 'Always index', 'wordpress-seo' );
		$this->no_index_options['noindex'] = __( 'Always noindex', 'wordpress-seo' );

		$this->sitemap_include_options['-']      = __( 'Auto detect', 'wordpress-seo' );
		$this->sitemap_include_options['always'] = __( 'Always include', 'wordpress-seo' );
		$this->sitemap_include_options['never']  = __( 'Never include', 'wordpress-seo' );
	}


	/**
	 * Test whether we are on a public taxonomy - no metabox actions needed if we are not
	 * Unfortunately we have to hook most everything in before the point where all taxonomies are registered and
	 * we know which taxonomy is being requested, so we need to use this check in nearly every hooked in function.
	 *
	 * @since 1.5.0
	 */
	public function admin_enqueue_scripts() {
		if ( $GLOBALS['pagenow'] !== 'edit-tags.php' ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'scoring' );

		if ( filter_input( INPUT_GET, 'action' ) === 'edit' ) {
			wp_enqueue_media(); // Enqueue files needed for upload functionality.

			$asset_manager->enqueue_style( 'yoast-seo' );
			$asset_manager->enqueue_style( 'metabox-css' );
			$asset_manager->enqueue_style( 'snippet' );

			wp_editor( '', 'description' );

			$asset_manager->enqueue_script( 'metabox-taxonomypage' );
			$asset_manager->enqueue_script( 'yoast-seo' );
			$asset_manager->enqueue_script( 'term-scraper' );
			$asset_manager->enqueue_script( 'replacevar-plugin' );

			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'term-scraper', 'wpseoTermScraperL10n', $this->localize_term_scraper_script() );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'replacevar-plugin', 'wpseoReplaceVarsL10n', $this->localize_replace_vars_script() );

			$asset_manager->enqueue_style( 'jquery-qtip.js' );
			$asset_manager->enqueue_script( 'jquery-qtip' );

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
		}
		unset( $key, $default );

		// Saving the values.
		WPSEO_Taxonomy_Meta::set_values( $term_id, $taxonomy, $new_meta_data );
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
	 * Pass variables to js for use with the term-scraper
	 *
	 * @return array
	 */
	public function localize_term_scraper_script() {
		$translations = $this->get_scraper_translations();

		$term_id  = filter_input( INPUT_GET, 'tag_ID' );
		$term     = get_term_by( 'id', $term_id, $this->get_taxonomy() );
		$focuskw  = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'focuskw' );
		$taxonomy = get_taxonomy( $term->taxonomy );
		$options  = WPSEO_Options::get_option( 'wpseo_permalinks' );

		$base_url = home_url( '/', null );
		if ( ! $options['stripcategorybase'] ) {
			$base_url = trailingslashit( $base_url . $taxonomy->rewrite['slug'] );
		}

		return array(
			'translations'      => $translations,
			'base_url'          => $base_url,
			'taxonomy'          => $term->taxonomy,
			'keyword_usage'     => WPSEO_Taxonomy_Meta::get_keyword_usage( $focuskw, $term->term_id, $term->taxonomy ),
			// Todo: a column needs to be added on the termpages to add a filter for the keyword, so this can be used in the focus kw doubles.
			'search_url'        => admin_url( 'edit-tags.php?taxonomy=' . $term->taxonomy . '&seo_kw_filter={keyword}' ),
			'post_edit_url'     => admin_url( 'edit-tags.php?action=edit&taxonomy=' . $term->taxonomy . '&tag_ID={id}' ),
			'title_template'    => WPSEO_Taxonomy::get_title_template( $term ),
			'metadesc_template' => WPSEO_Taxonomy::get_metadesc_template( $term ),
			'contentTab'        => __( 'Content:', 'wordpress-seo' ),
			'locale'            => get_locale(),
		);
	}

	/**
	 * Retrieves the title template.
	 *
	 * @param object $term taxonomy term.
	 *
	 * @return string
	 */
	public static function get_title_template( $term ) {
		if ( is_object( $term ) && property_exists( $term, 'taxonomy' ) ) {
			$needed_option = 'title-tax-' . $term->taxonomy;

			return self::get_template( $needed_option );
		}

		return '';
	}

	/**
	 * Retrieves the metadesc template.
	 *
	 * @param object $term taxonomy term.
	 *
	 * @return string
	 */
	public static function get_metadesc_template( $term ) {
		if ( is_object( $term ) && property_exists( $term, 'taxonomy' ) ) {
			$template_option_name = 'metadesc-tax-' . $term->taxonomy;

			return self::get_template( $template_option_name );
		}

		return '';
	}

	/**
	 * Pass some variables to js for replacing variables.
	 */
	public function localize_replace_vars_script() {
		return array(
			'no_parent_text' => __( '(no parent)', 'wordpress-seo' ),
			'replace_vars'   => $this->get_replace_vars(),
		);
	}

	/**
	 * Retrieves a template.
	 *
	 * @param String $template_option_name The name of the option in which the template you want to get is saved.
	 *
	 * @return string
	 */
	private static function get_template( $template_option_name ) {
		$options  = WPSEO_Options::get_option( 'wpseo_titles' );
		$template = '';
		if ( isset( $options[ $template_option_name ] ) && $options[ $template_option_name ] !== '' ) {
			$template = $options[ $template_option_name ];
		}

		return $template;
	}

	/**
	 * Prepares the replace vars for localization.
	 *
	 * @return array replace vars.
	 */
	private function get_replace_vars() {
		$term_id                 = filter_input( INPUT_GET, 'tag_ID' );
		$term                    = get_term_by( 'id', $term_id, $this->get_taxonomy() );
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

	/**
	 * Returns Jed compatible YoastSEO.js translations.
	 *
	 * @return array
	 */
	private function get_scraper_translations() {
		$file = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . get_locale() . '.json';
		if ( file_exists( $file ) && $file = file_get_contents( $file ) ) {
			return json_decode( $file, true );
		}

		return array();
	}

} /* End of class */
