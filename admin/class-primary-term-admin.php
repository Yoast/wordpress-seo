<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Adds the UI to change the primary term for a post
 */
class WPSEO_Primary_Term_Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_footer', array( $this, 'wp_footer' ), 10 );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		add_action( 'save_post', array( $this, 'save_primary_terms' ) );
		add_filter( 'post_link_category', array( $this, 'post_link_category' ) );
	}

	/**
	 * Add primary term templates
	 */
	public function wp_footer() {
		$taxonomies = $this->get_primary_term_taxonomies();

		if ( ! empty( $taxonomies ) ) {
			$this->include_js_templates();
		}
	}

	/**
	 * Enqueues all the assets needed for the primary term interface
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		global $pagenow;

		if ( $pagenow !== 'post.php' && $pagenow !== 'post-new.php' ) {
			return;
		}

		$taxonomies = $this->get_primary_term_taxonomies();

		// Only enqueue if there are taxonomies that need a primary term.
		if ( empty( $taxonomies ) ) {
			return;
		}

		wp_enqueue_style( 'wpseo-primary-category', plugins_url( 'css/metabox-primary-category' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );

		wp_enqueue_script( 'wpseo-primary-category', plugins_url( 'js/wp-seo-metabox-category' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery', 'wp-util' ), WPSEO_VERSION, true );

		$taxonomies = array_map( array( $this, 'map_taxonomies_for_js' ), $taxonomies );

		$data = array(
			'taxonomies' => $taxonomies,
		);
		wp_localize_script( 'wpseo-primary-category', 'wpseoPrimaryCategoryL10n', $data );
	}

	/**
	 * Saves all selected primary terms
	 *
	 * @param int $post_ID Post ID to save primary terms for.
	 */
	public function save_primary_terms( $post_ID ) {
		$taxonomies = $this->get_primary_term_taxonomies( $post_ID );

		foreach ( $taxonomies as $taxonomy ) {
			$this->save_primary_term( $post_ID, $taxonomy );
		}
	}

	/**
	 * Filters post_link_category to change the category to the chosen category by the user
	 *
	 * @param stdClass $category The category that is now used for the post link.
	 *
	 * @return array|null|object|WP_Error The category we want to use for the post link.
	 */
	public function post_link_category( $category ) {
		$primary_category = $this->get_primary_term( 'category' );

		if ( false !== $primary_category && $primary_category !== $category->cat_ID ) {
			$category = $this->get_category( $primary_category );
		}

		return $category;
	}

	/**
	 * /**
	 * Get the id of the primary term
	 *
	 * @param string $taxonomy_name Taxonomy name for the term.
	 *
	 * @return int primary term id
	 */
	protected function get_primary_term( $taxonomy_name ) {
		$primary_term = new WPSEO_Primary_Term( $taxonomy_name, get_the_ID() );

		return $primary_term->get_primary_term();
	}

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled
	 *
	 * @param int $post_ID Default current post ID.
	 * @return array
	 */
	protected function get_primary_term_taxonomies( $post_ID = null ) {

		if ( null === $post_ID ) {
			$post_ID = get_the_ID();
		}

		if ( false !== ( $taxonomies = wp_cache_get( 'primary_term_taxonomies_' . $post_ID, 'wpseo' ) ) ) {
			return $taxonomies;
		}

		$taxonomies = $this->generate_primary_term_taxonomies( $post_ID );

		wp_cache_set( 'primary_term_taxonomies_' . $post_ID, $taxonomies, 'wpseo' );

		return $taxonomies;
	}

	/**
	 * Include templates file
	 */
	protected function include_js_templates() {
		include_once WPSEO_PATH . '/admin/views/js-templates-primary-term.php';
	}

	/**
	 * Save the primary term for a specific taxonomy
	 *
	 * @param int     $post_ID  Post ID to save primary term for.
	 * @param WP_Term $taxonomy Taxonomy to save primary term for.
	 */
	protected function save_primary_term( $post_ID, $taxonomy ) {
		$primary_term = filter_input( INPUT_POST, WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_term', FILTER_SANITIZE_NUMBER_INT );

		// We accept an empty string here because we need to save that if no terms are selected.
		if ( null !== $primary_term && check_admin_referer( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_nonce' ) ) {
			$primary_term_object = new WPSEO_Primary_Term( $taxonomy->name, $post_ID );
			$primary_term_object->set_primary_term( $primary_term );
		}
	}

	/**
	 * Wrapper for get category to make mocking easier
	 *
	 * @param int $primary_category id of primary category.
	 *
	 * @return array|null|object|WP_Error
	 */
	protected function get_category( $primary_category ) {
		$category = get_category( $primary_category );

		return $category;
	}

	/**
	 * Generate the primary term taxonomies.
	 *
	 * @param int $post_ID ID of the post.
	 *
	 * @return array
	 */
	protected function generate_primary_term_taxonomies( $post_ID ) {
		$post_type      = get_post_type( $post_ID );
		$all_taxonomies = get_object_taxonomies( $post_type, 'objects' );
		$all_taxonomies = array_filter( $all_taxonomies, array( $this, 'filter_hierarchical_taxonomies' ) );
		$taxonomies     = array_filter( $all_taxonomies, array( $this, 'filter_category_taxonomy' ) );

		/**
		 * Filters which taxonomies for which the user can choose the primary term. Only category is enabled by default.
		 *
		 * @api array    $taxonomies An array of taxonomy objects that are primary_term enabled.
		 *
		 * @param string $post_type      The post type for which to filter the taxonomies.
		 * @param array  $all_taxonomies All taxonomies for this post types, even ones that don't have primary term
		 *                               enabled.
		 */
		$taxonomies = (array) apply_filters( 'wpseo_primary_term_taxonomies', $taxonomies, $post_type, $all_taxonomies );

		return $taxonomies;
	}

	/**
	 * Returns an array suitable for use in the javascript
	 *
	 * @param stdClass $taxonomy The taxonomy to map.
	 *
	 * @return array
	 */
	private function map_taxonomies_for_js( $taxonomy ) {
		$primary_term = $this->get_primary_term( $taxonomy->name );

		return array(
			'title'   => $taxonomy->labels->singular_name,
			'name'    => $taxonomy->name,
			'primary' => $primary_term ? $primary_term : '',
			'terms'   => array_map( array( $this, 'map_terms_for_js' ), get_terms( $taxonomy->name ) ),
		);
	}

	/**
	 * Returns an array suitable for use in the javascript
	 *
	 * @param stdClass $term The term to map.
	 *
	 * @return array
	 */
	private function map_terms_for_js( $term ) {
		return array(
			'id'   => $term->term_id,
			'name' => $term->name,
		);
	}

	/**
	 * Returns whether or not a taxonomy is hierarchical
	 *
	 * @param stdClass $taxonomy Taxonomy object.
	 *
	 * @return bool
	 */
	private function filter_hierarchical_taxonomies( $taxonomy ) {
		return true === $taxonomy->hierarchical;
	}

	/**
	 * Returns whether or not the taxonomy is the category taxonomy
	 *
	 * @param stdClass $taxonomy Taxonomy object.
	 *
	 * @return bool
	 */
	private function filter_category_taxonomy( $taxonomy ) {
		return 'category' === $taxonomy->name;
	}
}
