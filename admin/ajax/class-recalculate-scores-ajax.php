<?php
/**
 * @package WPSEO\Admin|Ajax
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
			WPSEO_Utils::json_encode(
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

		$response = $this->get_fetch_object()->get_items_to_recalculate( filter_input( INPUT_POST, 'paged', FILTER_VALIDATE_INT ) );
		if ( ! empty( $response ) ) {
			$response = WPSEO_Utils::json_encode( $response );
		}
		else {
			$response = '';
		}

		// Set WPSEO version to current recalculation.
		update_option( 'wpseo_last_recalculation', WPSEO_VERSION );

		wp_die( $response );
	}

	/**
	 * Saves the new linkdex score for given post
	 */
	public function save_score() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		$this->get_fetch_object()->save_scores( $scores = filter_input( INPUT_POST, 'scores', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) );

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
				break;
			default:
				return new WPSEO_Recalculate_Terms();
				break;
		}
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
				'posts_per_page' => -1,
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
