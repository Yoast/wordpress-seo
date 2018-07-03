<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Meta_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the method without a term object.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term()
	 */
	public function test_get_meta_without_term_when_no_term_is_set() {
		$this->assertFalse( WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}

	/**
	 * Tests the method with a term object that has no taxonomy.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term()
	 */
	public function test_get_meta_without_term_when_taxonomy_is_missing() {
		$GLOBALS['wp_query']->queried_object = self::factory()
			->term
			->create_and_get(
				array(
					'taxonomy' => null,
				)
			);

		$this->assertFalse( WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}

	/**
	 * Tests the method with a valid term object.
	 *
	 * @covers WPSEO_Taxonomy_Meta::get_meta_without_term()
	 */
	public function test_get_meta_with_valid_term() {
		$GLOBALS['wp_query']->queried_object = self::factory()
			->term
			->create_and_get(
				array(
					'taxonomy' => 'category',
				)
			);

		$this->assertEquals( '', WPSEO_Taxonomy_Meta::get_meta_without_term( 'meta_field' ) );
	}
}
