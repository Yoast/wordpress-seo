<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

if ( class_exists( 'WP_REST_Server' ) ) :
	/**
	 * Class WPSEO_WP_REST_Server_Mock
	 */
	class WPSEO_WP_REST_Server_Mock extends WP_REST_Server {

		/**
		 * @return array
		 */
		public function get_endpoints() {
			return $this->endpoints;
		}
	}
endif;
