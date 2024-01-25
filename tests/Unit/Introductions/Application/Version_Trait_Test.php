<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Yoast\WP\SEO\Tests\Unit\Doubles\Introductions\Version_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the user allowed trait.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Version_Trait
 */
final class Version_Trait_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var Version_Trait_Double
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Version_Trait_Double();
	}

	/**
	 * Tests the is version between.
	 *
	 * @covers ::is_version_between
	 *
	 * @dataProvider is_version_between_get_data
	 *
	 * @param string $version     The version to check.
	 * @param string $min_version The minimum version (inclusive).
	 * @param string $max_version The maximum version (exclusive).
	 * @param bool   $expected    The expected result.
	 *
	 * @return void
	 */
	public function test_is_version_between( $version, $min_version, $max_version, $expected ) {
		$this->assertSame( $expected, $this->instance->is_version_between( $version, $min_version, $max_version ) );
	}

	/**
	 * Data provider for the `test_is_version_between()` test.
	 *
	 * @return array
	 */
	public static function is_version_between_get_data() {
		return [
			'minor version'     => [
				'version'     => '21.0',
				'min_version' => '21.0-RC1',
				'max_version' => '21.1-RC1',
				'expected'    => true,
			],
			'patch version'     => [
				'version'     => '21.0.1',
				'min_version' => '21.0-RC1',
				'max_version' => '21.1-RC1',
				'expected'    => true,
			],
			'RC version'        => [
				'version'     => '21.0-RC2',
				'min_version' => '21.0-RC1',
				'max_version' => '21.1-RC1',
				'expected'    => true,
			],
			'inclusive minimum' => [
				'version'     => '21.0-RC1',
				'min_version' => '21.0-RC1',
				'max_version' => '21.1-RC1',
				'expected'    => true,
			],
			'exclusive maximum' => [
				'version'     => '21.1-RC1',
				'min_version' => '21.0-RC1',
				'max_version' => '21.1-RC1',
				'expected'    => false,
			],
		];
	}
}
