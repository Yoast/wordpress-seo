<?php
/**
 * @package WPSEO
 */

/**
 * Represents a post's primary term
 */
class WPSEO_Primary_Term {

	/**
	 * @var string
	 */
	protected $taxonomy_name;

	/**
	 * @var int
	 */
	protected $post_ID;

	/**
	 * The taxonomy this term is part of
	 *
	 * @param string $taxonomy_name
	 * @param int    $post_ID
	 */
	public function __construct( $taxonomy_name, $post_ID ) {
		$this->taxonomy_name = $taxonomy_name;
		$this->post_ID = $post_ID;
	}

	/**
	 * Returns the primary term ID
	 *
	 * @return int
	 */
	public function get_primary_term() {
		$primary_term = get_post_meta( $this->post_ID, WPSEO_Meta::$meta_prefix . 'primary_' . $this->taxonomy_name, true );

		// By default the first term (sorted by ID) is the primary term.
		if ( ! $primary_term ) {
			$terms = get_the_terms( $this->post_ID, $this->taxonomy_name );

			if ( ! empty( $terms ) ) {
				usort( $terms, '_usort_terms_by_ID' );
				$primary_term = array_shift( $terms );
				$primary_term = $primary_term->term_id;
			}
		}

		return ( (int) $primary_term ) ? ( (int) $primary_term ) : false;
	}

	/**
	 * Set's the new primary term ID
	 *
	 * @param int $new_primary_term
	 */
	public function set_primary_term( $new_primary_term ) {
		update_post_meta( $this->post_ID, WPSEO_Meta::$meta_prefix . 'primary_' . $this->taxonomy_name, $new_primary_term );
	}
}
