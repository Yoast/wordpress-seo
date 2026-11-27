<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Post_Meta_Rest_Fields;

use stdClass;

/**
 * Test class for the normalize_primary_term_meta method.
 *
 * @group initializers
 *
 * @covers Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields::normalize_primary_term_meta
 */
final class Normalize_Primary_Term_Meta_Test extends Abstract_Test {

	/**
	 * Tests that normalize_primary_term_meta normalizes the value of a primary term meta key.
	 *
	 * @dataProvider provide_primary_term_meta_values
	 *
	 * @param array<string|int|null>|stdClass|string|int|null $value    The value from the earlier filters.
	 * @param array<string>|string|null                       $expected The expected normalized value.
	 *
	 * @return void
	 */
	public function test_normalize_primary_term_meta( $value, $expected ) {
		$this->assertSame(
			$expected,
			$this->instance->normalize_primary_term_meta( $value, 1, '_yoast_wpseo_primary_category' ),
		);
	}

	/**
	 * Provides the values for the normalize_primary_term_meta test.
	 *
	 * @return array<string, array<array<string|int|null>|stdClass|string|int|null>>
	 */
	public static function provide_primary_term_meta_values() {
		return [
			'No value from the earlier filters' => [ null, null ],
			'An integer'                        => [ 5, '5' ],
			'A string'                          => [ '5', '5' ],
			'An array with an integer'          => [ [ 5 ], [ '5' ] ],
			'An array with a string'            => [ [ '5' ], [ '5' ] ],
			'An array with only null'           => [ [ null ], null ],
			'An empty array'                    => [ [], null ],
			'An object'                         => [ new stdClass(), null ],
		];
	}

	/**
	 * Tests that normalize_primary_term_meta leaves the value of other meta keys as it is.
	 *
	 * @dataProvider provide_other_meta_keys
	 *
	 * @param string $meta_key The meta key.
	 *
	 * @return void
	 */
	public function test_normalize_primary_term_meta_leaves_other_meta_keys_alone( $meta_key ) {
		$this->assertSame(
			[ 5 ],
			$this->instance->normalize_primary_term_meta( [ 5 ], 1, $meta_key ),
		);
	}

	/**
	 * Provides the meta keys that normalize_primary_term_meta leaves alone.
	 *
	 * @return array<string, array<string>>
	 */
	public static function provide_other_meta_keys() {
		return [
			'Another Yoast SEO meta key'   => [ '_yoast_wpseo_focuskw' ],
			'A meta key of another plugin' => [ 'primary_category' ],
			'No meta key'                  => [ '' ],
		];
	}
}
