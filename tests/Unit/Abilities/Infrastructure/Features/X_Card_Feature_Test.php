<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Brain\Monkey;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\X_Card_Feature;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the X_Card_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\X_Card_Feature
 */
final class X_Card_Feature_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var X_Card_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new X_Card_Feature();
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'x_card', $this->instance->get_key() );
		$this->assertSame( 'twitter', $this->instance->get_option_name() );
		$this->assertSame( 'X card data', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true, as the feature can be changed on every site.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Features\Abstract_Feature::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that is_disabled_programmatically returns whether the `wpseo_output_twitter_card` filter turns the X
	 * card meta tags off.
	 *
	 * @covers ::is_disabled_programmatically
	 *
	 * @dataProvider provide_is_disabled_programmatically_cases
	 *
	 * @param mixed $filtered The value the filter returns.
	 * @param bool  $expected Whether the feature is expected to be turned off programmatically.
	 *
	 * @return void
	 */
	public function test_is_disabled_programmatically( $filtered, bool $expected ) {
		Monkey\Filters\expectApplied( 'wpseo_output_twitter_card' )->once()->with( true )->andReturn( $filtered );

		$this->assertSame( $expected, $this->instance->is_disabled_programmatically() );
	}

	/**
	 * Provides the cases for test_is_disabled_programmatically.
	 *
	 * The front end only drops the tags when the filter returns exactly false, so other falsy values do not count.
	 *
	 * @return array<string, array<string, bool|int>>
	 */
	public static function provide_is_disabled_programmatically_cases() {
		return [
			'Disabled by the filter' => [
				'filtered' => false,
				'expected' => true,
			],
			'Not disabled by the filter' => [
				'filtered' => true,
				'expected' => false,
			],
			'Falsy value other than false' => [
				'filtered' => 0,
				'expected' => false,
			],
		];
	}
}
