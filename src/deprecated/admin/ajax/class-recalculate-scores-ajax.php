<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Ajax
 */

/**
 * Class WPSEO_Recalculate_Scores.
 *
 * This class handles the SEO score recalculation for all posts with a filled focus keyword.
 *
 * @deprecated  14.4
 * @codeCoverageIgnore
 */
class WPSEO_Recalculate_Scores_Ajax {

	/**
	 * Initialize the AJAX hooks.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );
	}

	/**
	 * Get the totals for the posts and the terms.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 */
	public function get_total() {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		wp_die();
	}

	/**
	 * Start recalculation.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 */
	public function recalculate_scores() {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		wp_die();
	}

	/**
	 * Saves the new linkdex score for given post.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 */
	public function save_score() {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		wp_die();
	}
}
