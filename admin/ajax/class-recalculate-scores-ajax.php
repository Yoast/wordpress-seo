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
	}

	/**
	 * Start recalculation
	 */
	public function recalculate_scores() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		wp_die(
			$this->get_fetch_object()->get_items_to_recalculate( filter_input( INPUT_POST, 'paged', FILTER_VALIDATE_INT ) )
		);
	}

	/**
	 * Saving the new linkdex score for given post
	 */
	public function save_score() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		$this->get_fetch_object()->save_scores( $scores = filter_input( INPUT_POST, 'scores', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) );

		wp_die();
	}

	/**
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

}
