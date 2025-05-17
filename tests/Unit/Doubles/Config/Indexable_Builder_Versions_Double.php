<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Config;

use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Builder_Versions_Double
 */
final class Indexable_Builder_Versions_Double extends Indexable_Builder_Versions {

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
	 * @param string $key   The Indexable type to mock.
	 * @param int    $value The Mocked value.
	 *
	 * @return void
	 */
	public function mock_version( $key, $value ) {
		$this->indexable_builder_versions_by_type[ $key ] = $value;
	}
}
