<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Ajax
 */

/**
 * Class WPSEO_Recalculate_Scores
 *
 * This class handles the SEO score recalculation for all posts with a filled focus keyword
 */
class WPSEO_Recalculate_Scores_Ajax {

	/**
	 * Initialize the AJAX hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_recalculate_scores', array( $this, 'recalculate_scores' ) );
		add_action( 'wp_ajax_wpseo_update_score', array( $this, 'save_score' ) );
		add_action( 'wp_ajax_wpseo_recalculate_total', array( $this, 'get_total' ) );
	}

	/**
	 * Get the totals for the posts and the terms.
	 */
	public function get_total() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		wp_die(
			wp_json_encode(
				array(
					'posts' => $this->calculate_posts(),
					'terms' => $this->calculate_terms(),
				)
			)
		);
	}

	/**
	 * Start recalculation
	 */
	public function recalculate_scores() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		$fetch_object = $this->get_fetch_object();
		if ( ! empty( $fetch_object ) ) {
			$paged    = filter_input( INPUT_POST, 'paged', FILTER_VALIDATE_INT );
			$response = $fetch_object->get_items_to_recalculate( $paged );

			if ( ! empty( $response ) ) {
				wp_die( wp_json_encode( $response ) );
			}
		}

		wp_die( '' );
	}

	/**
	 * Saves the new linkdex score for given post
	 */
	public function save_score() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		$fetch_object = $this->get_fetch_object();
		if ( ! empty( $fetch_object ) ) {
			$scores = filter_input( INPUT_POST, 'scores', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
			$fetch_object->save_scores( $scores );
		}

		wp_die();
	}

	/**
	 * Returns the needed object for recalculating scores.
	 *
	 * @return WPSEO_Recalculate_Posts|WPSEO_Recalculate_Terms
	 */
	private function get_fetch_object() {
		switch ( filter_input( INPUT_POST, 'type' ) ) {
			case 'post':
				return new WPSEO_Recalculate_Posts();
			case 'term':
				return new WPSEO_Recalculate_Terms();
		}

		return null;
	}

	/**
	 * Gets the total number of posts
	 *
	 * @return int
	 */
	private function calculate_posts() {
		$count_posts_query = new WP_Query(
			array(
				'post_type'      => 'any',
				'meta_key'       => '_yoast_wpseo_focuskw',
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);

		return $count_posts_query->found_posts;
	}

	/**
	 * Get the total number of terms
	 *
	 * @return int
	 */
	private function calculate_terms() {
		$total = 0;
		foreach ( get_taxonomies( array(), 'objects' ) as $taxonomy ) {
			$total += wp_count_terms( $taxonomy->name, array( 'hide_empty' => false ) );
		}

		return $total;
	}
}
