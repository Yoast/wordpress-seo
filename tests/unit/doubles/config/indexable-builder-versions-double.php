<?php


namespace doubles\config;

use Yoast\WP\SEO\Config\Indexable_Builder_Versions;

class Indexable_Builder_Versions_Double extends Indexable_Builder_Versions {

	/**
	 * Accessor for protected field indexable_builder_versions_by_type used in tests.
	 *
	 * @return array
	 */
	public function get_versions() {
		return $this->indexable_builder_versions_by_type;
	}

	/**
	 * Sets a specific indexable type to a specific version.
	 *
	 * @param $key   string The Indexable type to mock.
	 * @param $value int    The Mocked value.
	 */
	public function mock_version( $key, $value ) {
		$this->indexable_builder_versions_by_type[ $key ] = $value;
	}
}
