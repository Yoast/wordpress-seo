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
			include_once WPSEO_PATH . '/admin/views/js-templates-primary-term.php';
		}
	}

	/**
	 * Enqueues all the assets needed for the primary term interface
	 */
	public function enqueue_assets() {
		$taxonomies = $this->get_primary_term_taxonomies();

		// Only enqueue if there are taxonomies that need a primary term.
		if ( empty( $taxonomies ) ) {
			return;
		}

		wp_enqueue_style( 'wpseo-primary-category', plugins_url( 'css/metabox-primary-category' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );

		wp_enqueue_script( 'wpseo-primary-category', plugins_url( 'js/wp-seo-metabox-category' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );

		$taxonomies = array_map( function ( $taxonomy ) {

			$terms = get_terms( $taxonomy->name );

			$primary_term = new WPSEO_Primary_Term( $taxonomy->name, get_the_ID() );

			return array(
				'title'   => $taxonomy->labels->singular_name,
				'name'    => $taxonomy->name,
				'primary' => $primary_term->get_primary_term(),
				'terms'   => array_map( function ( $term ) {
					return array(
						'id'   => $term->term_id,
						'name' => $term->name,
					);
				}, $terms ),
			);
		}, $taxonomies );

		$data = array(
			'taxonomies' => $taxonomies,
		);
		wp_localize_script( 'wpseo-primary-category', 'wpseoPrimaryCategoryL10n', $data );
	}

	/**
	 * Saves all selected primary terms
	 *
	 * @param int $post_ID
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
		$primary_category = new WPSEO_Primary_Term( 'category', get_the_ID() );
		$primary_category = $primary_category->get_primary_term();

		if ( false !== $primary_category && $primary_category !== $category->cat_ID ) {
			$category = get_category( $primary_category );
		}

		return $category;
	}

	/**
	 * Save the primary term for a specific taxonomy
	 *
	 * @param int      $post_ID
	 * @param stdClass $taxonomy
	 */
	private function save_primary_term( $post_ID, $taxonomy ) {
		$primary_term = filter_input( INPUT_POST, WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_term', FILTER_SANITIZE_NUMBER_INT );

		if ( null === $primary_term ) {
			return;
		}

		if ( ! check_admin_referer( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_nonce' ) ) {
			return;
		}

		$primary_term_object = new WPSEO_Primary_Term( $taxonomy->name, $post_ID );
		$primary_term_object->set_primary_term( $primary_term );
	}

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled
	 *
	 * @param int $post_ID Default current post ID.
	 * @return array
	 */
	private function get_primary_term_taxonomies( $post_ID = null ) {

		if ( false !== ( $taxonomies = wp_cache_get( 'primary_term_taxonomies_' . $post_ID, 'wpseo' ) ) ) {
			return $taxonomies;
		}

		$post_type      = get_post_type( $post_ID );
		$all_taxonomies = get_object_taxonomies( $post_type, 'objects' );
		$all_taxonomies = array_filter( $all_taxonomies, array( $this, 'filter_hierarchical_taxonomies' ) );
		$taxonomies     = array_filter( $all_taxonomies, array( $this, 'filter_category_taxonomy' ) );

		/**
		 * Filters which taxonomies for which the user can choose the primary term. Only category is enabled by default.
		 *
		 * @api array $taxonomies An array of taxonomy objects that are primary_term enabled.
		 * @param string $post_type The post type for which to filter the taxonomies.
		 * @param array $all_taxonomies All taxonomies for this post types, even ones that don't have primary term
		 *                              enabled.
		 */
		$taxonomies = apply_filters( 'wpseo_primary_term_taxonomies', $taxonomies, $post_type, $all_taxonomies );

		wp_cache_set( 'primary_term_taxonomies_' . $post_ID, $taxonomies, 'wpseo' );

		return $taxonomies;
	}

	/**
	 * Returns whether or not a taxonomy is hierarchical
	 *
	 * @param stdClass $taxonomy
	 *
	 * @return bool
	 */
	private function filter_hierarchical_taxonomies( $taxonomy ) {
		return true === $taxonomy->hierarchical;
	}

	/**
	 * Returns whether or not the taxonomy is the category taxonomy
	 *
	 * @param stdClass $taxonomy
	 *
	 * @return bool
	 */
	private function filter_category_taxonomy( $taxonomy ) {
		return 'category' === $taxonomy->name;
	}
}
