<?php

class WPSEO_Export_Keywords_Query_Double extends WPSEO_Export_Keywords_Query {
	public function get_selects() {
		return $this->selects;
	}

	public function get_joins() {
		return $this->joins;
	}

	public function run_add_meta_join( $alias, $key ) {
		$this->add_meta_join( $alias, $key );
	}

	public function run_set_columns() {
		$this->set_columns();
	}

	public function return_convert_result_keywords( $result ) {
		return $this->convert_result_keywords( $result );
	}

	public function return_get_rating_from_int_score( $score ) {
		return $this->get_rating_from_int_score( $score );
	}

	public function return_get_rating_from_string_score( $score ) {
		return $this->get_rating_from_string_score( $score );
	}
}

class WPSEO_Export_Keywords_Query_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests the add_meta_join function for constructing joins.
	 */
	public function test_add_meta_join() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		$class_instance->run_add_meta_join( 'meta_alias', 'meta_key' );

		$this->assertEquals( 'meta_alias_join.meta_value AS meta_alias', $class_instance->get_selects()[0] );

		$this->assertEquals( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS meta_alias_join ' .
							 'ON meta_alias_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							 'AND meta_alias_join.meta_key = "meta_key"', $class_instance->get_joins()[0] );
	}

	/**
	 * Tests that you can't add snippets of SQL by using add_meta_join.
	 */
	public function test_add_meta_join_no_sql_injection() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		$class_instance->run_add_meta_join( '; DROP TABLE wp_posts;', '; DROP TABLE wp_posts;' );

		$this->assertNotContains( 'DROP TABLE wp_posts', $class_instance->get_selects()[0] );

		$this->assertNotContains( 'DROP TABLE wp_posts', $class_instance->get_joins()[0] );
	}

	/**
	 * Tests if set_columns works with simple columns that exist on the posts table.
	 */
	public function test_set_columns_simple() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title' ), $wpdb );

		$class_instance->run_set_columns();

		$this->assertContains( $wpdb->prefix . 'posts.ID', $class_instance->get_selects() );
		$this->assertContains( $wpdb->prefix . 'posts.post_title', $class_instance->get_selects() );
		$this->assertEmpty( $class_instance->get_joins() );
	}

	/**
	 * Tests if set_columns works with all possible columns.
	 */
	public function test_set_columns_complete() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title', 'post_url', 'keywords', 'seo_score', 'keywords_score' ), $wpdb );

		$class_instance->run_set_columns();

		$this->assertContains( $wpdb->prefix . 'posts.ID', $class_instance->get_selects() );
		$this->assertContains( $wpdb->prefix . 'posts.post_title', $class_instance->get_selects() );
		$this->assertContains( 'primary_keyword_join.meta_value AS primary_keyword', $class_instance->get_selects() );
		$this->assertContains( 'primary_keyword_score_join.meta_value AS primary_keyword_score', $class_instance->get_selects() );
		$this->assertContains( 'other_keywords_join.meta_value AS other_keywords', $class_instance->get_selects() );
		$this->assertContains( 'seo_score_join.meta_value AS seo_score', $class_instance->get_selects() );

		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS primary_keyword_join ' .
							   'ON primary_keyword_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND primary_keyword_join.meta_key = "_yoast_wpseo_focuskw"', $class_instance->get_joins() );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS primary_keyword_score_join ' .
							   'ON primary_keyword_score_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND primary_keyword_score_join.meta_key = "_yoast_wpseo_linkdex"', $class_instance->get_joins() );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS seo_score_join ' .
							   'ON seo_score_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND seo_score_join.meta_key = "_yoast_wpseo_content_score"', $class_instance->get_joins() );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS other_keywords_join ' .
							   'ON other_keywords_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND other_keywords_join.meta_key = "_yoast_wpseo_focuskeywords"', $class_instance->get_joins() );
	}

	/**
	 * Tests how set_columns deals with random input.
	 */
	public function test_set_columns_random_input() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'bla', 'foo', 'DROP TABLE wp_posts;', 2, true ), $wpdb );

		$class_instance->run_set_columns();

		$this->assertCount( 1, $class_instance->get_selects() );
		$this->assertEquals( $wpdb->prefix . 'posts.ID', $class_instance->get_selects()[0] );

		$this->assertEmpty( $class_instance->get_joins() );
	}

	/**
	 * Tests if convert_result_keywords works with expected input.
	 */
	public function test_convert_result_keywords() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'keywords', 'keywords_score' ), $wpdb );

		$fake_result = array(
			'primary_keyword' => 'foo',
			'primary_keyword_score' => '90',
			'other_keywords' => '[{"keyword": "bar", "score": "bad"}]'
		);

		$result = $class_instance->return_convert_result_keywords( $fake_result );

		$this->assertEquals( 'foo', $result['keywords'][0] );
		$this->assertEquals( 'bar', $result['keywords'][1] );
		$this->assertCount( 2, $result['keywords'] );

		$this->assertEquals( 'good', $result['keywords_score'][0] );
		$this->assertEquals( 'needs improvement', $result['keywords_score'][1] );
		$this->assertCount( 2, $result['keywords_score'] );
	}

	/**
	 * Tests if convert_result_keywords works with malformed input.
	 */
	public function test_convert_result_keywords_malformed() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'keywords', 'keywords_score' ), $wpdb );

		$fake_result = array(
			'primary_keyword' => 'foo',
			'primary_keyword_score' => '90',
			'other_keywords' => '[{"keyword" => "bar", what_even_is_this?}]'
		);

		$result = $class_instance->return_convert_result_keywords( $fake_result );

		$this->assertEquals( 'foo', $result['keywords'][0] );
		$this->assertCount( 1, $result['keywords'] );

		$this->assertEquals( 'good', $result['keywords_score'][0] );
		$this->assertCount( 1, $result['keywords_score'] );
	}

	/**
	 * Tests the get_rating_from_int_score function
	 */
	public function test_get_rating_from_int_score() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		// Check legitimate input.
		$this->assertEquals('none', $class_instance->return_get_rating_from_int_score( 0 ) );
		$this->assertEquals('needs improvement', $class_instance->return_get_rating_from_int_score( 5 ) );
		$this->assertEquals('ok', $class_instance->return_get_rating_from_int_score( 50 ) );
		$this->assertEquals('good', $class_instance->return_get_rating_from_int_score( 80 ) );

		// Check malformed input.
		$this->assertEquals('none', $class_instance->return_get_rating_from_int_score( true ) );
		$this->assertEquals('none', $class_instance->return_get_rating_from_int_score( 'bar' ) );
		$this->assertEquals('none', $class_instance->return_get_rating_from_int_score( array() ) );
	}

	/**
	 * Tests the get_rating_from_string_score function
	 */
	public function test_get_rating_from_string_score() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		// Check legitimate input.
		$this->assertEquals('none', $class_instance->return_get_rating_from_string_score( 'none' ) );
		$this->assertEquals('needs improvement', $class_instance->return_get_rating_from_string_score( 'bad' ) );
		$this->assertEquals('ok', $class_instance->return_get_rating_from_string_score( 'ok' ) );
		$this->assertEquals('good', $class_instance->return_get_rating_from_string_score( 'good' ) );

		// Check malformed input.
		$this->assertEquals('none', $class_instance->return_get_rating_from_string_score( true ) );
		$this->assertEquals('none', $class_instance->return_get_rating_from_string_score( 25 ) );
		$this->assertEquals('none', $class_instance->return_get_rating_from_string_score( array() ) );
	}
}
