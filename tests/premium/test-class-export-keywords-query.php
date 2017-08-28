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
}

class WPSEO_Export_Keywords_Query_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests the add_meta_join function for constructing joins.
	 *
	 * @covers WPSEO_Export_Keywords_Query::add_meta_join
	 */
	public function test_add_meta_join() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		$class_instance->run_add_meta_join( 'meta_alias', 'meta_key' );

		$selects = $class_instance->get_selects();
		$joins = $class_instance->get_joins();

		$this->assertEquals( 'meta_alias_join.meta_value AS meta_alias', $selects[0] );

		$this->assertEquals( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS meta_alias_join ' .
							 'ON meta_alias_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							 'AND meta_alias_join.meta_key = "meta_key"', $joins[0] );
	}

	/**
	 * Tests that you can't add snippets of SQL by using add_meta_join.
	 *
	 * @covers WPSEO_Export_Keywords_Query::add_meta_join
	 */
	public function test_add_meta_join_no_sql_injection() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( ), $wpdb );

		$class_instance->run_add_meta_join( '; DROP TABLE wp_posts;', '; DROP TABLE wp_posts;' );

		$selects = $class_instance->get_selects();
		$joins = $class_instance->get_joins();

		$this->assertNotContains( 'DROP TABLE wp_posts', $selects[0] );

		$this->assertNotContains( 'DROP TABLE wp_posts', $joins[0] );
	}

	/**
	 * Tests if set_columns works with simple columns that exist on the posts table.
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::set_columns
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
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::set_columns
	 */
	public function test_set_columns_complete() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title', 'post_url', 'keywords', 'seo_score', 'keywords_score' ), $wpdb );

		$class_instance->run_set_columns();

		$selects = $class_instance->get_selects();
		$joins = $class_instance->get_joins();

		$this->assertCount( 6, $selects );
		$this->assertContains( $wpdb->prefix . 'posts.ID', $selects );
		$this->assertContains( $wpdb->prefix . 'posts.post_title', $selects );
		$this->assertContains( 'primary_keyword_join.meta_value AS primary_keyword', $selects );
		$this->assertContains( 'primary_keyword_score_join.meta_value AS primary_keyword_score', $selects );
		$this->assertContains( 'other_keywords_join.meta_value AS other_keywords', $selects );
		$this->assertContains( 'seo_score_join.meta_value AS seo_score', $selects );

		$this->assertCount( 4, $joins );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS primary_keyword_join ' .
							   'ON primary_keyword_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND primary_keyword_join.meta_key = "_yoast_wpseo_focuskw"', $joins );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS primary_keyword_score_join ' .
							   'ON primary_keyword_score_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND primary_keyword_score_join.meta_key = "_yoast_wpseo_linkdex"', $joins );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS seo_score_join ' .
							   'ON seo_score_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND seo_score_join.meta_key = "_yoast_wpseo_content_score"', $joins );
		$this->assertContains( 'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS other_keywords_join ' .
							   'ON other_keywords_join.post_id = ' . $wpdb->prefix . 'posts.ID ' .
							   'AND other_keywords_join.meta_key = "_yoast_wpseo_focuskeywords"', $joins );
	}

	/**
	 * Tests how set_columns deals with random input.
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::set_columns
	 */
	public function test_set_columns_random_input() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'bla', 'foo', 'DROP TABLE wp_posts;', 2, true ), $wpdb );

		$class_instance->run_set_columns();

		$selects = $class_instance->get_selects();
		$joins = $class_instance->get_joins();

		$this->assertCount( 1, $class_instance->get_selects() );
		$this->assertEquals( $wpdb->prefix . 'posts.ID', $selects[0] );

		$this->assertEmpty( $joins );
	}

	/**
	 * Tests the get_data with expected input.
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::get_data
	 */
	public function test_get_data() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title', 'post_url', 'keywords', 'seo_score', 'keywords_score' ), $wpdb );

		// Create fake data.
		$fake_post = $this->factory->post->create( array( 'post_title' => 'fake post' ) );
		add_post_meta( $fake_post, '_yoast_wpseo_content_score', '80' );
		add_post_meta( $fake_post, '_yoast_wpseo_focuskw', 'foo' );
		add_post_meta( $fake_post, '_yoast_wpseo_linkdex', '10' );
		add_post_meta( $fake_post, '_yoast_wpseo_focuskeywords', '[{"keyword": "foo", "score": "good"},{"keyword": "baz", "score": "bad"}]' );

		$results = $class_instance->get_data();

		$this->assertCount( 1, $results );
		$this->assertEquals( $fake_post, $results[0]['ID'] );
		$this->assertEquals( 'fake post', $results[0]['post_title'] );
		$this->assertEquals( '80', $results[0]['seo_score'] );
		$this->assertEquals( 'foo', $results[0]['primary_keyword'] );
		$this->assertEquals( '10', $results[0]['primary_keyword_score'] );
		$this->assertEquals( '[{"keyword": "foo", "score": "good"},{"keyword": "baz", "score": "bad"}]', $results[0]['other_keywords'] );

		// And clean up fake data, factory created objects are automatically cleaned up. Unfortunately there's no meta factory.
		delete_post_meta( $fake_post, '_yoast_wpseo_content_score' );
		delete_post_meta( $fake_post, '_yoast_wpseo_focuskw' );
		delete_post_meta( $fake_post, '_yoast_wpseo_linkdex' );
		delete_post_meta( $fake_post, '_yoast_wpseo_focuskeywords' );
	}

	/**
	 * Tests the get_data with private input.
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::get_data
	 */
	public function test_get_data_public_only() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title', 'post_url', 'keywords', 'seo_score', 'keywords_score' ), $wpdb );

		// Create fake data.
		$fake_post = $this->factory->post->create( array( 'post_title' => 'fake post', 'post_status' => 'draft' ) );
		add_post_meta( $fake_post, '_yoast_wpseo_content_score', '80' );
		add_post_meta( $fake_post, '_yoast_wpseo_focuskw', 'foo' );
		add_post_meta( $fake_post, '_yoast_wpseo_linkdex', '10' );
		add_post_meta( $fake_post, '_yoast_wpseo_focuskeywords', '[{"keyword": "foo", "score": "good"},{"keyword": "baz", "score": "bad"}]' );

		$results = $class_instance->get_data();

		$this->assertCount( 0, $results );

		// And clean up fake data, factory created objects are automatically cleaned up. Unfortunately there's no meta factory.
		delete_post_meta( $fake_post, '_yoast_wpseo_content_score' );
		delete_post_meta( $fake_post, '_yoast_wpseo_focuskw' );
		delete_post_meta( $fake_post, '_yoast_wpseo_linkdex' );
		delete_post_meta( $fake_post, '_yoast_wpseo_focuskeywords' );
	}

	/**
	 * Tests the get_data with null input.
	 *
	 * @covers WPSEO_Export_Keywords_Query::__construct
	 * @covers WPSEO_Export_Keywords_Query::get_data
	 */
	public function test_get_data_null() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Query_Double( array( 'post_title', 'post_url', 'keywords', 'seo_score', 'keywords_score' ), $wpdb );

		// Create fake data.
		$fake_post = $this->factory->post->create( array( 'post_title' => 'fake post' ) );

		$results = $class_instance->get_data();

		$this->assertCount( 1, $results );
		$this->assertEquals( $fake_post, $results[0]['ID'] );
		$this->assertEquals( 'fake post', $results[0]['post_title'] );
		$this->assertNull( $results[0]['seo_score'] );
		$this->assertNull( $results[0]['primary_keyword'] );
		$this->assertNull( $results[0]['primary_keyword_score'] );
		$this->assertNull( $results[0]['other_keywords'] );
	}
}
