<?php

namespace Yoast\WP\SEO\Dependency_Injection;

/**
 * Loads the schema templates from the file system.
 */
class Schema_Templates_Loader {

	/**
	 * Retrieves the templates to load.
	 *
	 * @return array Array with all the template files.
	 */
	public function get_templates() {
		// When we have minimal PHP 7.0 support, we can replace the nested dirname call by using the levels argument.
		$root_directory = dirname( dirname( __DIR__ ) );
		$templates      = glob( $root_directory . '/src/schema-templates/*.php' );
		if ( ! $templates ) {
			$templates = [];
		}

		return $templates;
	}
}
