<?php

namespace Yoast\WP\SEO\Tests\Unit\Values\Indexables;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

class Indexable_Builder_Versions_Test extends TestCase {
	/**
	 * @var Indexable_Builder_Versions
	 *
	 * @coversDefaultClass \Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions
	 * @covers \Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions
	 *
	 * @group values
	 * @group indexables
	 */
	protected $instance;

	/**
	 * {@inheritDoc}
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Builder_Versions();
	}

	/**
	 * Tests that the get_latest_version_for_type function returns the latest version of the requested type.
	 *
	 * @covers ::get_latest_version_for_type
	 */
	public function test_get_latest_version_for_type() {
		$this->assertSame( $this->instance->get_latest_version_for_type( 'user' ), 3 );
	}

	/**
	 * Tests that the get_latest_versing_for_type function returns the default version number if the requested type is not known.
	 *
	 * @covers ::get_latest_version_for_type
	 */
	public function test_get_latest_version_for_type_fallback_to_default_version() {
		$this->assertSame( $this->instance->get_latest_version_for_type( 'something-else' ), 1 );
	}

	/**
	 * Tests that the test_get_combined_version_key function returns a string representation of all latest versions and includes exactly 8 versions.
	 *
	 * @covers ::get_combined_version_key
	 */
	public function test_get_combined_version_key() {
		$actual = $this->instance->get_combined_version_key();

		$this->assertSame( $actual, '2-2-3-3-3-3-3-2' );
		$this->assertSame( count( explode( '-', $actual ) ), 8 );
	}

	/**
	 * Tests that the version_compare function compares the individual version numbers in the combined version string using the operator.
	 *
	 * @param string $version_1 The first version to compare.
	 * @param string $operator The compare operator.  <, lt, >, gt, !=, <>, ne, <=,le, >=, ge, ==, = or eq.
	 * @param string $version_2 The second version to compare.
	 * @param bool $expected The expected result.
	 *
	 * @covers ::version_compare
	 *
	 * @dataProvider version_compare_data_provider
	 */
	public function test_version_compare( $version_1, $operator, $version_2, $expected ) {
		$this->assertSame( $this->instance->version_compare( $version_1, $operator, $version_2 ), $expected );
	}

	/**
	 * Tests that the function doesn't accept strings with combined version strings with a different number of versions in it.
	 *
	 * @covers ::version_compare
	 */
	public function test_version_compare_invalid_input() {
		$this->expectException( \InvalidArgumentException::class );
		$this->instance->version_compare( '1-2-3', '=', '1-2-3-4' );
	}


	/**
	 * A data provider for the test_version_compare test.
	 *
	 * @return array[] The test input.
	 */
	public function version_compare_data_provider() {
		return [
			[ '2-3-3', '>', '2-3-3', false ],
			[ '2-3-3', '>=', '2-3-3', true ],
			[ '2-3-4', '>', '2-3-3', true ],
			[ '4-4-4', '>', '2-3-3', true ],
			[ '2-3-3', '>', '4-4-4', false ],
			[ '4-4-2', '>', '3-3-3', false ],
			[ '4-4-4', '=', '3-3-3', false ],
			[ '4-4-4', '=', '4-4-4', true ],
			[ '4-4-4', '==', '4-4-3', false ],
			[ '4-4-4', '<>', '4-4-3', true ],
			[ '3-6-4', '<', '4-4-4', false ],
			[ '3-6-4', '<', '4-4-4', false ],
			[ '3-6-4', '>=', '4-4-4', false ],
			[ '4-6-4', '>=', '4-4-4', true ],
		];
	}
}
