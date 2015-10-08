<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Autoloader
 */
class WPSEO_Premium_Autoloader {

	/**
	 * Autoloader load method. Load the class.
	 *
	 * @param string $class The requested class name.
	 */
	public function load( $class ) {

		// Only WPSEO classes.
		if ( 0 === strpos( $class, 'WPSEO_' ) ) {

			// String to lower.
			$class = strtolower( $class );

			// Format file name.
			$file_name = 'class-' . str_ireplace( '_', '-', str_ireplace( 'WPSEO_', '', $class ) ) . '.php';

			// Full file path.
			$class_path = dirname( __FILE__ ) . '/';

			// Append file name to clas path.
			$full_path = $class_path . $file_name;

			// Check & load file.
			if ( file_exists( $full_path ) ) {
				require_once( $full_path );
			}
		}

	}

}
