<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use WPSEO_Options;
use Yoast\WPTestUtils\BrainMonkey\YoastTestCase;

/**
 * TestCase base class.
 */
abstract class TestCase extends YoastTestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns its first argument.
				'is_admin'             => false,
			]
		);

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		// This is required to ensure backfill and other statics are set.
		WPSEO_Options::get_instance();
	}

	/**
	 * Tests for expected output.
	 *
	 * @param string $expected    Expected output.
	 * @param string $description Explanation why this result is expected.
	 */
	protected function expectOutput( $expected, $description = '' ) {
		$output = \ob_get_contents();
		\ob_clean();

		$output   = \preg_replace( '|\R|', "\r\n", $output );
		$expected = \preg_replace( '|\R|', "\r\n", $expected );

		$this->assertEquals( $expected, $output, $description );
	}

	/**
	 * Tests if the output buffer contains the provided strings.
	 *
	 * @param string|array $expected Expected output.
	 */
	protected function expectOutputContains( $expected ) {
		$output = \preg_replace( '|\R|', "\r\n", \ob_get_contents() );
		\ob_clean();

		if ( ! \is_array( $expected ) ) {
			$expected = [ $expected ];
		}

		foreach ( $expected as $needle ) {
			$found = \strpos( $output, $needle );
			$this->assertTrue( $found !== false, \sprintf( 'Expected "%s" to be found in "%s" but couldn\'t find it.', $needle, $output ) );
		}
	}

	/**
	 * Tests if the output buffer doesn't contain the provided strings.
	 *
	 * @param string|array $needles Expected output.
	 */
	protected function expectOutputNotContains( $needles ) {
		$output = \preg_replace( '|\R|', "\r\n", \ob_get_contents() );
		\ob_clean();

		if ( ! \is_array( $needles ) ) {
			$needles = [ $needles ];
		}

		foreach ( $needles as $needle ) {
			$found = \strpos( $output, $needle );
			$this->assertTrue( $found === false, \sprintf( 'Expected "%s" to be found in "%s" but couldn\'t find it.', $needle, $output ) );
		}
	}

	/**
	 * Tests for expected empty output.
	 *
	 * @param string $description Explanation why this result is expected.
	 */
	protected function expectEmptyOutput( $description = '' ) {
		$output = \ob_get_contents();
		\ob_clean();

		$output = \preg_replace( '|\R|', "\r\n", $output );

		$this->assertEmpty( $output, $description );
	}
}
