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
		if ( is_admin() && $this->taxonomy !== '' && $this->show_metabox( ) ) {
			add_action( sanitize_text_field( $this->taxonomy ) . '_edit_form', array( $this, 'term_seo_form' ), 90, 1 );
		}

		add_action( 'split_shared_term', array( $this, 'split_shared_term' ), 10, 4 );
		add_action( 'edit_term', array( $this, 'update_term' ), 99, 3 );

		add_action( 'init', array( $this, 'custom_category_descriptions_allow_html' ) );
		add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Makes sure the taxonomy meta is updated when a taxonomy term is split.
	 *
	 * @link https://make.wordpress.org/core/2015/02/16/taxonomy-term-splitting-in-4-2-a-developer-guide/ Article explaining the taxonomy term splitting in WP 4.2.
	 *
	 * @param string $old_term_id      Old term id of the taxonomy term that was splitted.
	 * @param string $new_term_id      New term id of the taxonomy term that was splitted.
	 * @param string $term_taxonomy_id Term taxonomy id for the taxonomy that was affected.
	 * @param string $taxonomy         The taxonomy that the taxonomy term was splitted for.
	 */
	public function split_shared_term( $old_term_id, $new_term_id, $term_taxonomy_id, $taxonomy ) {
		$tax_meta = get_option( 'wpseo_taxonomy_meta', array() );

		if ( ! empty( $tax_meta[ $taxonomy ][ $old_term_id ] ) ) {
			$tax_meta[ $taxonomy ][ $new_term_id ] = $tax_meta[ $taxonomy ][ $old_term_id ];
			unset( $tax_meta[ $taxonomy ][ $old_term_id ] );
			update_option( 'wpseo_taxonomy_meta', $tax_meta );
		}
	}

	/**
	 * Adding the admin frontend assets.
	 */
	public function admin_enqueue_scripts() {
		if ( $GLOBALS['pagenow'] === 'edit-tags.php' && filter_input( INPUT_GET, 'action' ) === 'edit' ) {
			wp_enqueue_media(); // Enqueue files needed for upload functionality.

			wp_enqueue_style( 'yoast-metabox-css', plugins_url( 'css/metabox' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );

			wp_enqueue_script( 'wp-seo-metabox', plugins_url( 'js/wp-seo-metabox' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
				'jquery-ui-autocomplete',
			), WPSEO_VERSION, true );

			// Always enqueue minified as it's not our code.
			wp_enqueue_style( 'jquery-qtip.js', plugins_url( 'css/jquery.qtip' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), '2.2.1' );
			wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '2.2.1', true );

			wp_enqueue_script( 'wpseo-admin-media', plugins_url( 'js/wp-seo-admin-media' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
				'jquery',
				'jquery-ui-core',
			), WPSEO_VERSION, true );
			wp_localize_script( 'wpseo-admin-media', 'wpseoMediaL10n', array(
				'choose_image' => __( 'Use Image', 'wordpress-seo' ),
			) );
		}
	}


	/**
	 * Show the SEO inputs for term.
	 *
	 * @param object $term Term to show the edit boxes for.
	 */
	function term_seo_form( $term ) {
		if ( $this->tax_is_public() === false ) {
			return;
		}

		// Including the metabox taxonomy view.
		require_once( WPSEO_PATH . '/admin/views/metabox-taxonomy.php' );
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id  ID of the term to save data for.
	 * @param int    $tt_id    The taxonomy_term_id for the term.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 */
	public function update_term( $term_id, $tt_id, $taxonomy ) {
		$tax_meta = get_option( 'wpseo_taxonomy_meta' );

		/* Create post array with only our values */
		$new_meta_data = array();
		foreach ( WPSEO_Taxonomy_Meta::$defaults_per_term as $key => $default ) {
			if ( $posted_value = filter_input( INPUT_POST, $key ) ) {
				$new_meta_data[ $key ] = $posted_value;
			}
		}
		unset( $key, $default );

		/* Validate the post values */
		$old   = WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $taxonomy );
		$clean = WPSEO_Taxonomy_Meta::validate_term_meta_data( $new_meta_data, $old );

		/* Add/remove the result to/from the original option value */
		if ( $clean !== array() ) {
			$tax_meta[ $taxonomy ][ $term_id ] = $clean;
		}
		else {
			unset( $tax_meta[ $taxonomy ][ $term_id ] );
			if ( isset( $tax_meta[ $taxonomy ] ) && $tax_meta[ $taxonomy ] === array() ) {
				unset( $tax_meta[ $taxonomy ] );
			}
		}

		// Prevent complete array validation.
		$tax_meta['wpseo_already_validated'] = true;

		update_option( 'wpseo_taxonomy_meta', $tax_meta );
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
		$options    = WPSEO_Options::get_all();
		$option_key = 'hideeditbox-tax-' . $this->taxonomy;

		return ( ! isset( $options[ $option_key ] ) || $options[ $option_key ] === false );
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
	 * Test whether we are on a public taxonomy - no metabox actions needed if we are not
	 * Unfortunately we have to hook most everything in before the point where all taxonomies are registered and
	 * we know which taxonomy is being requested, so we need to use this check in nearly every hooked in function.
	 *
	 * @since 1.5.0
	 */
	private function tax_is_public() {
		// Don't make static as taxonomies may still be added during the run.
		$taxonomies = get_taxonomies( array( 'public' => true ), 'names' );

		return ( in_array( $this->taxonomy, $taxonomies ) );
	}

} /* End of class */
