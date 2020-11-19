<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use PHPUnit\Framework\TestCase as BaseTestCase;
use WPSEO_Options;

/**
 * TestCase base class.
 */
abstract class TestCase extends BaseTestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Set up the test fixtures.
	 */
	protected function setUp() {
		parent::setUp();
		Monkey\setUp();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns its first argument.
				'esc_attr'             => null,
				'esc_html'             => null,
				'esc_textarea'         => null,
				'__'                   => null,
				'_n'                   => function( $single, $plural, $number ) {
					if ( $number === 1 ) {
						return $single;
					}

					return $plural;
				},
				'_x'                   => null,
				'esc_html__'           => null,
				'esc_html_x'           => null,
				'esc_attr__'           => null,
				'esc_attr_x'           => null,
				'esc_url'              => null,
				'esc_url_raw'          => null,
				'esc_js'               => null,
				'sanitize_text_field'  => null,
				'is_admin'             => false,
				'is_multisite'         => false,
				'wp_kses_post'         => null,
				'site_url'             => 'https://www.example.org',
				'wp_json_encode'       => function( $data, $options = 0, $depth = 512 ) {
					// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encodeWithAdditionalParams -- Usage in tests is fine.
					return \json_encode( $data, $options, $depth );
				},
				'wp_slash'             => null,
				'wp_unslash'           => function( $value ) {
					return \is_string( $value ) ? \stripslashes( $value ) : $value;
				},
				'absint'               => function( $value ) {
					return \abs( \intval( $value ) );
				},
				'mysql2date'           => function( $format, $date ) {
					return $date;
				},
				'number_format_i18n'   => null,
				'wp_parse_args'        => function( $settings, $defaults ) {
					return \array_merge( $defaults, $settings );
				},
				'user_trailingslashit' => function( $string ) {
					return \trailingslashit( $string );
				},
				'wp_strip_all_tags'    => function( $string, $remove_breaks = false ) {
					$string = \preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $string );
					// phpcs:ignore WordPress.WP.AlternativeFunctions.strip_tags_strip_tags -- We are stubbing the wp_strip_all_tags.
					$string = \strip_tags( $string );

					if ( $remove_breaks ) {
						$string = \preg_replace( '/[\r\n\t ]+/', ' ', $string );
					}

					return \trim( $string );
				},
				'get_bloginfo'         => function( $show ) {
					switch ( $show ) {
						case 'charset':
							return 'UTF-8';
						case 'language':
							return 'English';
					}

					return $show;
				},
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
	 * Tear down the test fixtures.
	 */
	protected function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
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
}
