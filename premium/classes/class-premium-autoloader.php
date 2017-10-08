<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Autoloader
 */
class WPSEO_Premium_Autoloader {

	/**
	 * The part of the class we wanted to search
	 *
	 * @var string
	 */
	private $search_pattern;

	/**
	 * @var string
	 */
	private $directory;

	/**
	 * This piece will be added
	 *
	 * @var string
	 */
	private $file_replace;

	/**
	 * Setting up the class.
	 *
	 * @param string $search_pattern The pattern to match for the redirect.
	 * @param string $directory      The directory where the classes could be found.
	 * @param string $file_replace   The replacement for the file.
	 */
	public function __construct( $search_pattern, $directory, $file_replace = '' ) {
		$this->search_pattern = $search_pattern;
		$this->directory      = $directory;
		$this->file_replace   = ( $file_replace === '' ) ? $search_pattern : $file_replace;

		spl_autoload_register( array( $this, 'load' ) );
	}

	/**
	 * Autoloader load method. Load the class.
	 *
	 * @param string $class The requested class name.
	 */
	public function load( $class ) {
		// Check & load file.
		if ( $this->contains_search_pattern( $class ) ) {
			$found_file = $this->find_file( $class );
			if ( $found_file !== false ) {
				require_once $found_file;
			}
		}
	}

	/**
	 * Does the filename contains the search pattern
	 *
	 * @param string $class The classname to match.
	 *
	 * @return bool
	 */
	private function contains_search_pattern( $class ) {
		return 0 === strpos( $class, $this->search_pattern );
	}

	/**
	 * Searching for the file in the given directory
	 *
	 * @param string $class The class to search for.
	 *
	 * @return bool|string
	 */
	private function find_file( $class ) {
		// String to lower.
		$class = strtolower( $class );

		// Format file name.
		$file_name = $this->get_file_name( $class );

		// Full file path.
		$class_path = dirname( __FILE__ ) . '/';

		// Append file name to clas path.
		$full_path = $class_path . $this->directory . $file_name;

		// Check & load file.
		if ( file_exists( $full_path ) ) {
			return $full_path;
		}

		return false;

	}

	/**
	 * Parsing the file name
	 *
	 * @param string $class The classname to convert to a file name.
	 *
	 * @return string
	 */
	private function get_file_name( $class ) {
		return 'class-' . str_ireplace( '_', '-', str_ireplace( $this->file_replace, '', $class ) ) . '.php';
	}
}
