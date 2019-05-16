<?php

namespace Yoast\Tests;

use PHPUnit_Framework_TestCase;
use Brain\Monkey;

/**
 * TestCase base class.
 */
abstract class TestCase extends PHPUnit_Framework_TestCase {

	protected function setUp() {
		parent::setUp();
		Monkey\setUp();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns it's first argument.
				'esc_attr'       => null,
				'esc_html'       => null,
				'esc_textarea'   => null,
				'__'             => null,
				'_x'             => null,
				'esc_html__'     => null,
				'esc_html_x'     => null,
				'esc_attr_x'     => null,
				'is_admin'       => false,
				'is_multisite'   => false,
				'site_url'       => 'https://www.example.org',
				'wp_json_encode' => function( $data, $options = 0, $depth = 512 ) {
					return \json_encode( $data, $options, $depth );
				},
				'wp_slash'       => null,
				'absint'         => function( $value ) {
					return abs( intval( $value ) );
				},
			]
		);

		// This is required to ensure backfill and other statics are set.
		\WPSEO_Options::get_instance();

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( \Mockery::anyOf( 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( \Mockery::anyOf( 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ) )
			->andReturn( [] );
	}

	protected function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
	}
}
