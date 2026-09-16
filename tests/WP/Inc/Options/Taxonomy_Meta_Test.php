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

	/**
	 * Tests that saved values are stored in WordPress term meta.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_set_values_saves_to_term_meta() {
		$term = self::factory()->category->create_and_get();

		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => 'Term title' ] );

		$this->assertSame( 'Term title', \get_term_meta( $term->term_id, 'wpseo_title', true ) );

		$tax_meta = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertFalse( isset( $tax_meta['category'][ $term->term_id ] ) );
	}

	/**
	 * Tests that values saved through set_values survive the slashing done by the metadata API.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 * @covers WPSEO_Taxonomy_Meta::get_term_meta
	 *
	 * @return void
	 */
	public function test_set_values_preserves_backslashes() {
		$term = self::factory()->category->create_and_get();

		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => 'this can contain \backslashes\.' ] );

		$this->assertSame(
			'this can contain \backslashes\.',
			WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'title' ),
		);
	}

	/**
	 * Tests that a term without saved metadata returns the defaults.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_term_meta
	 *
	 * @return void
	 */
	public function test_get_term_meta_returns_defaults_for_untouched_term() {
		$term = self::factory()->category->create_and_get();

		$this->assertSame(
			WPSEO_Taxonomy_Meta::$defaults_per_term,
			WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category' ),
		);
	}

	/**
	 * Tests that metadata stored in WordPress term meta is picked up by the facade.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_term_meta
	 *
	 * @return void
	 */
	public function test_get_term_meta_reads_from_term_meta() {
		$term = self::factory()->category->create_and_get();

		\update_term_meta( $term->term_id, 'wpseo_desc', 'From term meta' );

		$this->assertSame( 'From term meta', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'desc' ) );
	}

	/**
	 * Tests that not yet migrated option values still work as a fallback.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_term_meta
	 *
	 * @return void
	 */
	public function test_get_term_meta_falls_back_to_the_option() {
		$term = self::factory()->category->create_and_get();

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_desc' => 'From the option' ] ] ] );

		$this->assertSame( 'From the option', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'desc' ) );
	}

	/**
	 * Tests that term meta takes precedence over a not yet removed option entry.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_term_meta
	 *
	 * @return void
	 */
	public function test_get_term_meta_prefers_term_meta_over_the_option() {
		$term = self::factory()->category->create_and_get();

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_desc' => 'From the option' ] ] ] );
		\update_term_meta( $term->term_id, 'wpseo_desc', 'From term meta' );

		$this->assertSame( 'From term meta', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'desc' ) );
	}

	/**
	 * Tests that saving a term removes its entry from the legacy option.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_set_values_removes_the_legacy_option_entry() {
		$term = self::factory()->category->create_and_get();

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_desc' => 'From the option' ] ] ] );

		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_desc' => 'New description' ] );

		$tax_meta = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertFalse( isset( $tax_meta['category'][ $term->term_id ] ) );
		$this->assertSame( 'New description', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'desc' ) );
	}

	/**
	 * Tests that resetting a value to its default removes it from term meta.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_set_values_removes_default_values_from_term_meta() {
		$term = self::factory()->category->create_and_get();

		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => 'Term title' ] );
		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => '' ] );

		$this->assertFalse( \metadata_exists( 'term', $term->term_id, 'wpseo_title' ) );
		$this->assertSame( '', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'title' ) );
	}

	/**
	 * Tests that keyword usage is found in both storage locations.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_keyword_usage
	 *
	 * @return void
	 */
	public function test_get_keyword_usage_checks_term_meta_and_the_option() {
		$migrated = self::factory()->category->create_and_get();
		$legacy   = self::factory()->category->create_and_get();
		$current  = self::factory()->category->create_and_get();

		WPSEO_Taxonomy_Meta::set_values( $migrated->term_id, 'category', [ 'wpseo_focuskw' => 'shared keyword' ] );
		\update_option(
			'wpseo_taxonomy_meta',
			[
				'category' => [
					$legacy->term_id  => [ 'wpseo_focuskw' => 'shared keyword' ],
					$current->term_id => [ 'wpseo_focuskw' => 'shared keyword' ],
				],
			],
		);

		$usage = WPSEO_Taxonomy_Meta::get_keyword_usage( 'shared keyword', $current->term_id, 'category' );

		$this->assertSame( [ 'shared keyword' => [ $migrated->term_id, $legacy->term_id ] ], $usage );
	}

	/**
	 * Tests migrating option values to term meta.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta() {
		$term = self::factory()->category->create_and_get();

		\update_option(
			'wpseo_taxonomy_meta',
			[
				'category' => [
					$term->term_id => [
						'wpseo_title' => 'Migrated title',
						'wpseo_desc'  => '',
					],
				],
			],
		);

		$this->assertSame( 1, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );
		$this->assertSame( 'Migrated title', \get_term_meta( $term->term_id, 'wpseo_title', true ) );

		// Default values are not stored redundantly.
		$this->assertFalse( \metadata_exists( 'term', $term->term_id, 'wpseo_desc' ) );

		// The option is deleted once every entry is migrated, not merely saved as an empty array.
		global $wpdb;
		$this->assertNull(
			$wpdb->get_var(
				$wpdb->prepare( 'SELECT option_name FROM ' . $wpdb->options . ' WHERE option_name = %s', 'wpseo_taxonomy_meta' ),
			),
		);
	}

	/**
	 * Tests that entries which cannot be migrated are handled by the option validation on save.
	 *
	 * Orphaned entries for deleted terms are removed, while entries for taxonomies
	 * which are not registered (yet) are kept.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta_keeps_unmigratable_entries() {
		\update_option(
			'wpseo_taxonomy_meta',
			[
				// Bypass validation when seeding the fixture, like the old save path did.
				'wpseo_already_validated' => true,
				'category'                => [ 999_999 => [ 'wpseo_title' => 'Orphaned entry' ] ],
				'no_such_tax'             => [ 1 => [ 'wpseo_title' => 'Unknown taxonomy' ] ],
			],
		);

		$this->assertSame( 0, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );

		$stored = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertFalse( isset( $stored['category'] ) );
		$this->assertSame( [ 'wpseo_title' => 'Unknown taxonomy' ], $stored['no_such_tax'][1] );
	}

	/**
	 * Tests that the migration respects the given limit.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta_with_limit() {
		$first  = self::factory()->category->create_and_get();
		$second = self::factory()->category->create_and_get();

		\update_option(
			'wpseo_taxonomy_meta',
			[
				'category' => [
					$first->term_id  => [ 'wpseo_title' => 'First title' ],
					$second->term_id => [ 'wpseo_title' => 'Second title' ],
				],
			],
		);

		$this->assertSame( 1, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta( 1 ) );
		$this->assertSame( 'First title', \get_term_meta( $first->term_id, 'wpseo_title', true ) );
		$this->assertSame( '', \get_term_meta( $second->term_id, 'wpseo_title', true ) );

		$stored = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertFalse( isset( $stored['category'][ $first->term_id ] ) );
		$this->assertTrue( isset( $stored['category'][ $second->term_id ] ) );
	}

	/**
	 * Tests that the migration can safely be run more than once.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta_is_idempotent() {
		$term = self::factory()->category->create_and_get();

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_title' => 'Migrated title' ] ] ] );

		$this->assertSame( 1, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );
		$this->assertSame( 0, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );
		$this->assertSame( 'Migrated title', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'title' ) );
	}

	/**
	 * Tests that the migration keeps values which are already present in term meta,
	 * as those were written after the legacy option entry was created.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta_keeps_newer_term_meta_values() {
		$term = self::factory()->category->create_and_get();

		\update_term_meta( $term->term_id, 'wpseo_title', 'Newer term meta title' );
		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_title' => 'Older option title' ] ] ] );

		$this->assertSame( 1, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );
		$this->assertSame( 'Newer term meta title', \get_term_meta( $term->term_id, 'wpseo_title', true ) );
		global $wpdb;
		$this->assertNull(
			$wpdb->get_var(
				$wpdb->prepare( 'SELECT option_name FROM ' . $wpdb->options . ' WHERE option_name = %s', 'wpseo_taxonomy_meta' ),
			),
		);
	}

	/**
	 * Tests that metadata for terms which are shared between taxonomies
	 * stays in the option, as term meta cannot hold taxonomy-specific values.
	 *
	 * @covers WPSEO_Taxonomy_Meta::migrate_legacy_term_meta
	 *
	 * @return void
	 */
	public function test_migrate_legacy_term_meta_keeps_shared_term_entries() {
		$term = self::factory()->category->create_and_get();
		$this->make_term_shared( $term->term_id );

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_title' => 'Shared title' ] ] ] );

		$this->assertSame( 0, WPSEO_Taxonomy_Meta::migrate_legacy_term_meta() );
		$this->assertFalse( \metadata_exists( 'term', $term->term_id, 'wpseo_title' ) );

		$stored = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertSame( 'Shared title', $stored['category'][ $term->term_id ]['wpseo_title'] );
	}

	/**
	 * Tests that saves for terms which are shared between taxonomies keep
	 * using the option, as term meta cannot hold taxonomy-specific values.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_set_values_saves_shared_terms_to_the_option() {
		$term = self::factory()->category->create_and_get();
		$this->make_term_shared( $term->term_id );

		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => 'Shared title' ] );

		$this->assertFalse( \metadata_exists( 'term', $term->term_id, 'wpseo_title' ) );

		$stored = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertSame( 'Shared title', $stored['category'][ $term->term_id ]['wpseo_title'] );
		$this->assertSame( 'Shared title', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'title' ) );
	}

	/**
	 * Tests that the legacy option entry survives a failing term meta write,
	 * so the previously stored values are not lost.
	 *
	 * @covers WPSEO_Taxonomy_Meta::set_values
	 *
	 * @return void
	 */
	public function test_set_values_keeps_legacy_entry_when_term_meta_write_fails() {
		$term = self::factory()->category->create_and_get();

		\update_option( 'wpseo_taxonomy_meta', [ 'category' => [ $term->term_id => [ 'wpseo_title' => 'Old title' ] ] ] );

		$block = static function () {
			return false;
		};
		\add_filter( 'update_term_metadata', $block );
		WPSEO_Taxonomy_Meta::set_values( $term->term_id, 'category', [ 'wpseo_title' => 'New title' ] );
		\remove_filter( 'update_term_metadata', $block );

		$this->assertSame( '', \get_term_meta( $term->term_id, 'wpseo_title', true ) );

		$stored = \get_option( 'wpseo_taxonomy_meta', [] );
		$this->assertSame( 'Old title', $stored['category'][ $term->term_id ]['wpseo_title'] );
		$this->assertSame( 'Old title', WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, 'category', 'title' ) );
	}

	/**
	 * Tests that splitting a shared term copies the term metadata to the new term,
	 * including values which contain backslashes.
	 *
	 * @covers ::wpseo_split_shared_term
	 *
	 * @return void
	 */
	public function test_wpseo_split_shared_term_copies_term_meta_to_the_new_term() {
		$term = self::factory()->category->create_and_get();

		/* Store a value the way the Yoast save path does, and then share the term. */
		\update_term_meta( $term->term_id, 'wpseo_title', \wp_slash( 'Title with \backslashes\.' ) );

		$term_taxonomy_id = $this->make_term_shared( $term->term_id );

		$new_term_id = \_split_shared_term( $term->term_id, $term_taxonomy_id );

		$this->assertNotSame( $term->term_id, $new_term_id );
		$this->assertSame( 'Title with \backslashes\.', \get_term_meta( $new_term_id, 'wpseo_title', true ) );
		$this->assertSame( 'Title with \backslashes\.', WPSEO_Taxonomy_Meta::get_term_meta( $new_term_id, 'category', 'title' ) );
	}

	/**
	 * Makes a category term shared with the post tag taxonomy by adding a second
	 * term taxonomy row directly, like terms were on installs which predate the
	 * WordPress 4.2 term splitting.
	 *
	 * @param int $term_id The term id to share.
	 *
	 * @return int The term taxonomy id of the category row.
	 */
	private function make_term_shared( $term_id ) {
		global $wpdb;

		$term_taxonomy_id = (int) $wpdb->get_var(
			$wpdb->prepare( 'SELECT term_taxonomy_id FROM ' . $wpdb->term_taxonomy . ' WHERE term_id = %d AND taxonomy = %s', $term_id, 'category' ),
		);

		$wpdb->insert(
			$wpdb->term_taxonomy,
			[
				'term_id'     => $term_id,
				'taxonomy'    => 'post_tag',
				'description' => '',
				'parent'      => 0,
				'count'       => 0,
			],
			[ '%d', '%s', '%s', '%d', '%d' ],
		);

		/*
		 * Core only reports a term as shared while it still carries the flag that
		 * unfinished term splitting is pending, like on installs which predate 4.2.
		 */
		\update_option( 'finished_splitting_shared_terms', '0' );

		return $term_taxonomy_id;
	}
}
