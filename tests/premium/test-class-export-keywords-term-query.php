<?php

class WPSEO_Export_Keywords_Term_Query_Double extends WPSEO_Export_Keywords_Term_Query {
	public function get_selects() {
		return $this->selects;
	}
}

class WPSEO_Export_Keywords_Term_Query_Database_Mock {
	public $prefix = 'bamboozled';

	public $query;

	public $type;

	public function get_results( $query, $type ) {
		$this->query = $query;
		$this->type = $type;
	}
}

class WPSEO_Export_Keywords_Term_Query_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests the set_columns function with good data.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Query::set_columns
	 */
	public function test_set_columns() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Term_Query_Double( $wpdb );
		$class_instance->set_columns( array( 'title' ) );

		$this->assertCount( 3, $class_instance->get_selects() );
		$this->assertContains( 'terms.term_id', $class_instance->get_selects() );
		$this->assertContains( 'taxonomies.taxonomy', $class_instance->get_selects() );
		$this->assertContains( 'terms.name', $class_instance->get_selects() );
	}

	/**
	 * Tests the set_columns function with bad data.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Query::set_columns
	 */
	public function test_bad_set_columns() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Term_Query_Double( $wpdb );
		$class_instance->set_columns( array( 'foo', true, null, array() ) );

		$this->assertCount( 2, $class_instance->get_selects() );
		$this->assertContains( 'terms.term_id', $class_instance->get_selects() );
		$this->assertContains( 'taxonomies.taxonomy', $class_instance->get_selects() );
	}

	/**
	 * Tests the get_data function with good data.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Query::get_data
	 */
	public function test_get_data() {
		$db = new WPSEO_Export_Keywords_Term_Query_Database_Mock();

		$class_instance = new WPSEO_Export_Keywords_Term_Query_Double( $db );
		$class_instance->set_columns( array( 'title' ) );
		$class_instance->get_data( 1 );

		$taxonomies = get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'names' );
		$taxonomies_escaped = implode( '", "', array_map( 'esc_sql', $taxonomies ) );

		$this->assertEquals( ARRAY_A, $db->type );
		$this->assertEquals(
			'SELECT terms.term_id, taxonomies.taxonomy, terms.name FROM ' .
			$db->prefix . 'terms AS terms INNER JOIN ' . $db->prefix .
			'term_taxonomy AS taxonomies ON terms.term_id = taxonomies.term_id ' .
			'AND taxonomies.taxonomy IN ("' . $taxonomies_escaped . '")',
			$db->query
		);
	}

	/**
	 * Tests the get_data function with pagination.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Query::get_data
	 */
	public function test_paginated_get_data() {
		$db = new WPSEO_Export_Keywords_Term_Query_Database_Mock();

		$class_instance = new WPSEO_Export_Keywords_Term_Query_Double( $db, 1000 );
		$class_instance->set_columns( array( 'title' ) );
		$class_instance->get_data( 2 );

		$taxonomies = get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'names' );
		$taxonomies_escaped = implode( '", "', array_map( 'esc_sql', $taxonomies ) );

		$this->assertEquals( ARRAY_A, $db->type );
		$this->assertEquals(
			'SELECT terms.term_id, taxonomies.taxonomy, terms.name FROM ' .
			$db->prefix . 'terms AS terms INNER JOIN ' . $db->prefix .
			'term_taxonomy AS taxonomies ON terms.term_id = taxonomies.term_id ' .
			'AND taxonomies.taxonomy IN ("' . $taxonomies_escaped . '") LIMIT 1000 OFFSET 1000',
			$db->query
		);
	}

	/**
	 * Tests the get_data function with bad input.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Query::get_data
	 */
	public function test_bad_get_data() {
		$db = new WPSEO_Export_Keywords_Term_Query_Database_Mock();

		$class_instance = new WPSEO_Export_Keywords_Term_Query_Double( $db, 1000 );
		$class_instance->set_columns( array( 'foo', true, null, array() ) );
		$class_instance->get_data( -999 );

		$taxonomies = get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'names' );
		$taxonomies_escaped = implode( '", "', array_map( 'esc_sql', $taxonomies ) );

		$this->assertEquals( ARRAY_A, $db->type );
		$this->assertEquals(
			'SELECT terms.term_id, taxonomies.taxonomy FROM ' .
			$db->prefix . 'terms AS terms INNER JOIN ' . $db->prefix .
			'term_taxonomy AS taxonomies ON terms.term_id = taxonomies.term_id ' .
			'AND taxonomies.taxonomy IN ("' . $taxonomies_escaped . '") LIMIT 1000 OFFSET 0',
			$db->query
		);
	}
}
