<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Adds the UI to change the primary category for a post
 */
class WPSEO_Primary_Category_Admin {

	/**
	 *
	 */
	public function __construct() {
		add_action( 'admin_footer', array( $this, 'wp_footer' ), 10 );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		add_action( 'save_post', array( $this, 'save_primary_terms' ) );
		add_filter( 'post_link_category', array( $this, 'post_link_category' ) );
	}

	/**
	 * Add category selector
	 */
	public function wp_footer() {
		include_once WPSEO_PATH . '/admin/views/js-primary-category-selector.php';
	}

	/**
	 * Enqueues all the assets needed for the primary category interface
	 */
	public function enqueue_assets() {
		/*
		 * @todo Add check if this post type actually has a taxonomy to choose the primary category in
		 */
		wp_enqueue_style( 'wpseo-primary-category', plugins_url( 'css/metabox-primary-category' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );

		wp_enqueue_script( 'wpseo-primary-category', plugins_url( 'js/wp-seo-metabox-category' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );

		$post_type = get_post_type();
		$taxonomies = get_object_taxonomies( $post_type, 'objects' );
		$taxonomies = array_filter( $taxonomies, function( $taxonomy ) {
			return true === $taxonomy->hierarchical;
		});
		$taxonomies = array_map( function( $taxonomy ) {

			$terms = get_terms( $taxonomy->name );

			return array(
				'title'   => $taxonomy->labels->singular_name,
				'name'    => $taxonomy->name,
				'primary' => $this->get_primary_term_id( $taxonomy->name, get_the_ID() ),
				'terms'   => array_map( function( $term ) {
					return array(
						'id'   => $term->term_id,
						'name' => $term->name,
					);
				}, $terms ),
			);
		}, $taxonomies );
		$taxonomies = array_values( $taxonomies );

		$primary_category = get_post_meta( get_the_ID(), '_yoast_seo_primary_category', true );

		$data = array(
			'primaryCategory' => $primary_category,
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

		$post_type = get_post_type( $post_ID );
		$taxonomies = get_object_taxonomies( $post_type, 'objects' );
		$taxonomies = array_filter( $taxonomies, function( $taxonomy ) {
			return true === $taxonomy->hierarchical;
		});

		foreach ( $taxonomies as $taxonomy ) {
			$this->save_primary_term( $post_ID, $taxonomy );
		}
	}

	/**
	 * Save the primary term for a specific taxonomy
	 *
	 * @param int      $post_ID
	 * @param stdClass $taxonomy
	 */
	private function save_primary_term( $post_ID, $taxonomy ) {
		if ( ! check_admin_referer( 'save-primary-term', WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_nonce' ) ) {
			return;
		}

		$primary_term = filter_input( INPUT_POST, WPSEO_Meta::$form_prefix . 'primary_' . $taxonomy->name . '_term', FILTER_SANITIZE_NUMBER_INT );

		$this->set_primary_term_id( $taxonomy->name, $post_ID, $primary_term );
	}

	/**
	 * Returns the primary taxonomy ID for a certain post and a taxonomy
	 *
	 * @param string $taxonomy
	 * @param int    $post_id
	 *
	 * @return false|int
	 */
	public function get_primary_term_id( $taxonomy, $post_id ) {
		$primary_category = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'primary_' . $taxonomy, true );

		// By default the first term (sorted by ID) is the primary term.
		if ( ! $primary_category ) {
			$terms = get_the_terms( $post_id, $taxonomy );

			if ( ! empty( $terms ) ) {
				usort( $terms, '_usort_terms_by_ID' );
				$primary_category = array_shift( $terms );
				$primary_category = $primary_category->term_id;
			}
		}

		return ( (int) $primary_category ) ? : false;
	}

	/**
	 * Set's the primary category for a certain post
	 *
	 * @param string $taxonomy The taxonomy to set the primary term.
	 * @param int    $post_id The post ID for which to set the primary category.
	 * @param int    $primary_term_id The primary category ID to set for the post.
	 */
	public function set_primary_term_id( $taxonomy, $post_id, $primary_term_id ) {
		update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'primary_' . $taxonomy, $primary_term_id );
	}

	/**
	 * Filters post_link_category to change the category to the chosen category by the user
	 *
	 * @param stdClass $category The category that is now used for the post link.
	 *
	 * @return array|null|object|WP_Error The category we want to use for the post link.
	 */
	public function post_link_category( $category ) {
		$primary_category = $this->get_primary_term_id( 'category', get_the_ID() );

		if ( false !== $primary_category && $primary_category !== $category->cat_ID ) {
			$category = get_category( $primary_category );
		}

		return $category;
	}
}
