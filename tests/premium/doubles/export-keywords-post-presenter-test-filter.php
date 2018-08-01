<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Class WPSEO_Export_Keywords_Presenter_Test_Filter
 *
 * Provides a simple filter to test against.
 */
class WPSEO_Export_Keywords_Post_Presenter_Test_Filter {

	/**
	 * Mock filter a title.
	 *
	 * @param string $title Post title.
	 * @param int    $id    Post ID.
	 *
	 * @return string
	 */
	public function filter( $title, $id ) {
		return 'filtered';
	}
}
