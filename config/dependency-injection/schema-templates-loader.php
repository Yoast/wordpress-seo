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
		$templates = glob( __DIR__ . '/../../src/schema-templates/*.php' );
		if ( ! $templates ) {
			$templates = [];
		}

		if ( \is_dir( __DIR__ . '/../../premium/src/schema-templates' ) ) {
			$additional_templates = glob( __DIR__ . '/../../premium/src/schema-templates/*.php' );
			if ( $additional_templates ) {
				$templates = array_merge( $templates, $additional_templates );
			}
		}

		return $templates;
	}
}
