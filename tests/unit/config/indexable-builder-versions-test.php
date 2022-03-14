<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Yoast\WP\SEO\Tests\Unit\Doubles\Config\Indexable_Builder_Versions_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Builder_Versions_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions
 */
class Indexable_Builder_Versions_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Builder_Versions
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Builder_Versions();
	}

	/**
	 * Tests the content the Indexable builder version array.
	 *
	 * @covers \Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions
	 */
	public function test_get_versions() {
		// Get the protected field from the test double.
		$versions = ( new Indexable_Builder_Versions_Double() )->get_versions();

		$this->assertEquals( 8, \count( $versions ) );
		$this->assertArrayHasKey( 'date-archive', $versions );
		$this->assertArrayHasKey( 'general', $versions );
		$this->assertArrayHasKey( 'home-page', $versions );
		$this->assertArrayHasKey( 'term', $versions );
		$this->assertArrayHasKey( 'post', $versions );
		$this->assertArrayHasKey( 'post-type-archive', $versions );
		$this->assertArrayHasKey( 'system-page', $versions );
		$this->assertArrayHasKey( 'user', $versions );
	}

	/**
	 * Tests getting versions for indexable builders.
	 *
	 * @dataProvider data_get_latest_version_for_type
	 *
	 * @covers ::get_latest_version_for_type
	 * @param mixed $key      The key of the indexable builder to check.
	 * @param mixed $expected The expected result.
	 */
	public function test_get_latest_version_for_type( $key, $expected ) {
		// Arrange.
		$this->instance = new Indexable_Builder_Versions_Double();

		$this->instance->mock_version( 'date-archive', 1337 );
		$this->instance->mock_version( 'general', 1337 );
		$this->instance->mock_version( 'home-page', 1337 );
		$this->instance->mock_version( 'term', 1337 );
		$this->instance->mock_version( 'post', 1337 );
		$this->instance->mock_version( 'post-type-archive', 1337 );
		$this->instance->mock_version( 'system-page', 1337 );
		$this->instance->mock_version( 'user', 1337 );

		// Act.
		$result = $this->instance->get_latest_version_for_type( $key );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Provides data for the test_get_latest_version_for_type test.
	 *
	 * @return array
	 */
	public function data_get_latest_version_for_type() {
		$default = Indexable_Builder_Versions::DEFAULT_INDEXABLE_BUILDER_VERSION;

		return [
			[ 'date-archive', 1337 ],
			[ 'general', 1337 ],
			[ 'home-page', 1337 ],
			[ 'term', 1337 ],
			[ 'post', 1337 ],
			[ 'post-type-archive', 1337 ],
			[ 'system-page', 1337 ],
			[ 'user', 1337 ],
			[ 'non-existing', $default ],
			[ null, $default ],
			[ 1, $default ],
		];
	}
}
