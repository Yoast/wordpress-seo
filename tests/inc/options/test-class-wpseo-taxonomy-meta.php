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

	/**
	 * Tests if data with slashes remains the same after validating.
	 *
	 * @dataProvider get_validated_term_meta_data_provider
	 *
	 * @param array  $expected The expected results - also used as input.
	 *
	 * @covers       WPSEO_Taxonomy_Meta::validate_term_meta_data()
	 */
	public function test_validate_term_meta_data( $expected ) {
		$this->assertEquals( $expected, WPSEO_Taxonomy_Meta::validate_term_meta_data( $expected, WPSEO_Taxonomy_Meta::$defaults_per_term ) );
	}

	/**
	 * DataProvider function for the test: test_validate_term_meta_data
	 *
	 * @return array With the $meta_key and $expected variables.
	 */
	public function get_validated_term_meta_data_provider() {
		return array(
			array( array( 'wpseo_focuskeywords' => '[{"keyword":"\\\"test\\\"","score":"good"},{"keyword":"\\\\","score":"bad"}]' ) ),
			array( array( 'wpseo_keywordsynonyms' => '["","\\"\\"TESTING\\"\\"",""]' ) ),
		);
	}
}
