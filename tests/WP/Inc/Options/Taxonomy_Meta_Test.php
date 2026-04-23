<?php

namespace Yoast\WP\SEO\Tests\WP\Inc\Options;

use WPSEO_Taxonomy_Meta;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Taxonomy_Meta_Test extends TestCase {

	/**
	 * Tests the method without a term object.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term
	 *
	 * @return void
	 */
	public function test_get_meta_without_term_when_no_term_is_set() {
		$this->assertFalse( WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}

	/**
	 * Tests the method with a term object that has no taxonomy.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term
	 *
	 * @return void
	 */
	public function test_get_meta_without_term_when_taxonomy_is_missing() {
		$GLOBALS['wp_query']->queried_object = self::factory()
			->term
			->create_and_get(
				[
					'taxonomy' => null,
				],
			);

		$this->assertFalse( WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}

	/**
	 * Tests the method with a valid term object.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term
	 *
	 * @return void
	 */
	public function test_get_meta_with_valid_term() {
		$GLOBALS['wp_query']->queried_object = self::factory()
			->term
			->create_and_get(
				[
					'taxonomy' => 'category',
				],
			);

		$this->assertEquals( '', WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}

	/**
	 * Tests if data with backslashes and double quotes remains the same after validating.
	 *
	 * @covers WPSEO_Taxonomy_Meta::validate_term_meta_data
	 *
	 * @return void
	 */
	public function test_validate_term_meta_data() {
		/*
		 * Using json_encode to stringify the test for readability,
		 * so it should closely resemble what a user could type in the field.
		 * Normally this is already provided like this through JavaScript.
		 */
		$input = [
			'wpseo_noindex'         => 'index',
			'wpseo_canonical'       => 'https://yoast.com/',
			'wpseo_bctitle'         => 'this can contain \backslashes\.',
			'wpseo_focuskeywords'   => WPSEO_Utils::format_json_encode(
				[
					[
						'keyword' => '\"test\"',
						'score'   => 'good',
					],
					[
						'keyword' => '\\',
						'score'   => 'bad',
					],
				],
			),
			'wpseo_keywordsynonyms' => WPSEO_Utils::format_json_encode( [ '""TESTING""', '""""' ] ),
			'wpseo_focuskw'         => '&quotdouble quotes" and \backslashes\.',
			'wpseo_title'           => '&quotdouble quotes" and \backslashes\.',
			'wpseo_desc'            => '&quotdouble quotes" and \backslashes\.',
			'wpseo_opengraph-title' => '&quotdouble quotes" and \backslashes\.',
		];
		$this->assertEquals( $input, WPSEO_Taxonomy_Meta::validate_term_meta_data( $input, WPSEO_Taxonomy_Meta::$defaults_per_term ) );
	}

	/**
	 * Tests that the taxonomy meta option is autoloaded by default.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_save_tax_meta_autoloads_by_default() {
		$term = self::factory()->term->create_and_get( [ 'taxonomy' => 'category' ] );

		WPSEO_Taxonomy_Meta::set_values(
			$term->term_id,
			'category',
			[ 'wpseo_title' => 'Test title' ],
		);

		$this->assertSame( 'on', $this->get_autoload_value( 'wpseo_taxonomy_meta' ) );
	}

	/**
	 * Tests that the taxonomy meta option autoload can be disabled via filter.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_save_tax_meta_respects_autoload_filter() {
		\add_filter( 'Yoast\WP\SEO\taxonomy_meta_option_autoload', '__return_false' );

		$term = self::factory()->term->create_and_get( [ 'taxonomy' => 'category' ] );

		WPSEO_Taxonomy_Meta::set_values(
			$term->term_id,
			'category',
			[ 'wpseo_title' => 'Test title' ],
		);

		$this->assertSame( 'off', $this->get_autoload_value( 'wpseo_taxonomy_meta' ) );

		\remove_filter( 'Yoast\WP\SEO\taxonomy_meta_option_autoload', '__return_false' );
	}

	/**
	 * Tests that removing the filter restores autoload to on.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_save_tax_meta_restores_autoload_when_filter_removed() {
		// First, disable autoload via filter.
		\add_filter( 'Yoast\WP\SEO\taxonomy_meta_option_autoload', '__return_false' );

		$term = self::factory()->term->create_and_get( [ 'taxonomy' => 'category' ] );

		WPSEO_Taxonomy_Meta::set_values(
			$term->term_id,
			'category',
			[ 'wpseo_title' => 'Test title' ],
		);

		$this->assertSame( 'off', $this->get_autoload_value( 'wpseo_taxonomy_meta' ) );

		// Remove the filter and save again.
		\remove_filter( 'Yoast\WP\SEO\taxonomy_meta_option_autoload', '__return_false' );

		WPSEO_Taxonomy_Meta::set_values(
			$term->term_id,
			'category',
			[ 'wpseo_title' => 'Updated title' ],
		);

		$this->assertSame( 'on', $this->get_autoload_value( 'wpseo_taxonomy_meta' ) );
	}

	/**
	 * Gets the autoload value for an option directly from the database.
	 *
	 * @param string $option_name The option name.
	 *
	 * @return string The autoload value ('on' or 'off').
	 */
	private function get_autoload_value( $option_name ) {
		global $wpdb;

		return $wpdb->get_var(
			$wpdb->prepare(
				"SELECT autoload FROM {$wpdb->options} WHERE option_name = %s",
				$option_name,
			),
		);
	}

	/**
	 * Tests if data gets validated as expected.
	 *
	 * @covers WPSEO_Taxonomy_Meta::validate_term_meta_data
	 *
	 * @return void
	 */
	public function test_validation_of_term_meta_data() {
		/*
		 * Using json_encode to stringify the test for readability,
		 * so it should closely resemble what a user could type in the field.
		 * Normally this is already provided like this through JavaScript.
		 */
		$expected = [
			'wpseo_bctitle'         => 'this can contain \backslashes\.',
			'wpseo_canonical'       => 'https://yoast.com/test%20space',
			'wpseo_focuskeywords'   => WPSEO_Utils::format_json_encode(
				[
					[
						'keyword' => '\"test\"',
						'score'   => 'good',
					],
					[
						'keyword' => '\\',
						'score'   => 'bad',
					],
				],
			),
			'wpseo_keywordsynonyms' => WPSEO_Utils::format_json_encode( [ '""TESTING""', '""""' ] ),
			'wpseo_focuskw'         => '&quotdouble quotes" and \backslashes\.',
			'wpseo_title'           => '&quotdouble quotes" and \backslashes\.',
			'wpseo_desc'            => '&quotdouble quotes" and \backslashes\.',
			'wpseo_opengraph-title' => '&quotdouble quotes" and \backslashes\.',
		];
		// With added data that is expected to be removed.
		$input = [
			'wpseo_noindex'         => 'extra something',
			'wpseo_canonical'       => 'https://yoast.com/test space',
			'wpseo_bctitle'         => 'this can contain \backslashes\.',
			'wpseo_focuskeywords'   => WPSEO_Utils::format_json_encode(
				[
					[
						'keyword' => '\"test\"',
						'score'   => 'good',
						'extra'   => 'will get removed',
					],
					[
						'keyword' => '\\',
						'score'   => 'bad',
					],
				],
			),
			'wpseo_keywordsynonyms' => WPSEO_Utils::format_json_encode( [ '""TESTING""', '""""' ] ),
			'wpseo_focuskw'         => '  &quotdouble quotes" `>&lt;&gt;&#96<`and \backslashes\.  ',
			'wpseo_title'           => '&quotdouble quotes"			and \backslashes\.',
			'wpseo_desc'            => '&quotdouble quotes" <>and<> \backslashes\.',
			'wpseo_opengraph-title' => '&quotdouble quotes" %aband \backslashes\.',
		];
		$this->assertEquals( $expected, WPSEO_Taxonomy_Meta::validate_term_meta_data( $input, WPSEO_Taxonomy_Meta::$defaults_per_term ) );
	}
}
