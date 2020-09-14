<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all terms.
 *
 * @deprecated 14.4
 * @codeCoverageIgnore
 */
class WPSEO_Recalculate_Terms extends WPSEO_Recalculate {

	/**
	 * Save the scores.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param array $scores The scores to save.
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
	 * Get the terms from the database by doing a WP_Query.
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
	 * Convert the given term into a analyzable object.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param mixed $item The term for which to build the analyzer data.
	 *
	 * @return array
	 */
	protected function item_to_response( $item ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return [];
	}
}
