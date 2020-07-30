<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Ryte_Request_Double extends WPSEO_Ryte_Request {

	/**
	 * Overwrite the get_remote method, because this is a dependency.
	 *
	 * @param string $target_url The home URL.
	 * @param array  $parameters Array of extra parameters.
	 *
	 * @return array
	 */
	protected function get_remote( $target_url, $parameters = [] ) {
		$remote_data = [
			'is_indexable'    => '0',
			'passes_juice_to' => '',
		];

		switch ( $target_url ) {
			case home_url():
				$remote_data['is_indexable'] = '1';
				break;

			case 'http:://will-be-redirected.wp':
				$remote_data = [
					'is_indexable'    => '0',
					'passes_juice_to' => 'http://is-redirected.wp',
				];
				break;

			case 'http://is-redirected.wp':
				$remote_data['is_indexable'] = '1';
				break;

			case 'http://not_indexable.wp':
				// Do noting.
				break;
		}

		return $remote_data;
	}
}
