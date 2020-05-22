<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all posts with a filled focus keyword.
 *
 * @deprecated 14.4
 * @codeCoverageIgnore
 */
class WPSEO_Recalculate_Posts extends WPSEO_Recalculate {

	/**
	 * Save the scores.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param array $scores The scores for the posts.
	 */
	public function save_scores( array $scores ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );
	}

	/**
	 * Save the score.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param array $score The score to save.
	 */
	protected function save_score( array $score ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );
	}

	/**
	 * Get the posts from the database by doing a WP_Query.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param integer $paged The page.
	 *
	 * @return array
	 */
	protected function get_items( $paged ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return [];
	}

	/**
	 * Map the posts to a response array.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param WP_Post $item The post for which to build the analyzer data.
	 *
	 * @return array
	 */
	protected function item_to_response( $item ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return [];
	}
}
