<?php

/**
 * Class WPSEO_Export_Keywords_Presenter_Double\
 *
 * A double for testing protected method.
 */
class WPSEO_Export_Keywords_Presenter_Double extends WPSEO_Export_Keywords_Presenter {
	public function return_validate_result( $result ) {
		return $this->validate_result( $result );
	}

	public function return_convert_result_keywords( $result ) {
		return $this->convert_result_keywords( $result );
	}
}

/**
 * Class WPSEO_Export_Keywords_Presenter_Test_Filter
 *
 * Provides a simple filter to test against.
 */
class WPSEO_Export_Keywords_Presenter_Test_Filter {
	public function filter( $title, $id ) {
		return "filtered";
	}
}

class WPSEO_Export_Keywords_Presenter_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests if validate_result works with expected input.
	 */
	public function test_validate_result() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title' ), $wpdb );

		$fake_result = array(
			'ID'         => '1',
			'post_title' => 'fake post',
		);

		$this->assertTrue( $class_instance->return_validate_result( $fake_result ) );
	}

	public function test_validate_input_false() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title' ), $wpdb );

		$fake_result = array(
			'ID'         => '1',
			'post_title' => true,
		);

		$this->assertFalse( $class_instance->return_validate_result( $fake_result ) );
		$this->assertFalse( $class_instance->return_validate_result( 'foo' ) );
		$this->assertFalse( $class_instance->return_validate_result( 5 ) );
		$this->assertFalse( $class_instance->return_validate_result( true ) );
		$this->assertFalse( $class_instance->return_validate_result( null ) );
	}

	/**
	 * Tests if convert_result_keywords works with expected input.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::__construct
	 * @covers WPSEO_Export_Keywords_Presenter::convert_result_keywords
	 * @covers WPSEO_Export_Keywords_Presenter::parse_result_keywords_json
	 */
	public function test_convert_result_keywords() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'keywords', 'keywords_score' ), $wpdb );

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
		$this->assertEquals( 'bad', $result['keywords_score'][1] );
		$this->assertCount( 2, $result['keywords_score'] );
	}

	/**
	 * Tests if convert_result_keywords works with malformed input.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::__construct
	 * @covers WPSEO_Export_Keywords_Presenter::convert_result_keywords
	 * @covers WPSEO_Export_Keywords_Presenter::parse_result_keywords_json
	 */
	public function test_convert_result_keywords_malformed() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'keywords', 'keywords_score' ), $wpdb );

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
	 * Tests the present function with it's intended use case.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::present
	 */
	public function test_present() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ), $wpdb );

		$fake_post = $this->factory->post->create( array( 'post_title' => 'fake post' ) );
		$fake_result = array(
			'ID' => var_export( $fake_post, true ),
			'post_title' => 'fake post',
			'seo_score' => '50',
			'primary_keyword' => 'bar',
			'primary_keyword_score' => '60',
			'other_keywords' => '[{"keyword": "foo", "score": "good"},{"keyword": "baz", "score": "bad"}]'
		);

		$result = $class_instance->present( $fake_result );

		$this->assertEquals( $fake_post, $result['ID'] );
		$this->assertEquals( 'fake post', $result['post_title'] );
		$this->assertEquals( get_permalink( $fake_post ), $result['post_url'] );
		$this->assertEquals( 'ok', $result['seo_score'] );
		$this->assertEquals( array( 'bar', 'foo', 'baz' ), $result['keywords'] );
		$this->assertEquals( array( 'ok', 'good', 'bad' ), $result['keywords_score'] );
	}

	/**
	 * Tests the present function for filter functionality.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::present
	 */
	public function test_present_filter() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title' ), $wpdb );

		$fake_result = array(
			'ID'         => '1',
			'post_title' => 'fake post',
		);

		$filter_class = new WPSEO_Export_Keywords_Presenter_Test_Filter();
		add_filter( 'the_title', array( $filter_class, 'filter'), 10, 2 );

		$result = $class_instance->present( $fake_result );

		$this->assertEquals( 'filtered', $result['post_title'] );

		remove_filter( 'the_title', array( $filter_class, 'filter'), 10 );
	}

	/**
	 * Tests the export function with malformed input.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::present
	 */
	public function test_present_malformed() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title' ), $wpdb );

		$this->assertFalse( $class_instance->present( 'foo' ) );
		$this->assertFalse( $class_instance->present( array( 'ID' => 'foo' ) ) );
		$this->assertFalse( $class_instance->present( array( 'ID' => 0, 'post_title' => true ) ) );
	}

	/**
	 * Tests the present function with null meta.
	 *
	 * @covers WPSEO_Export_Keywords_Presenter::present
	 */
	public function test_present_null() {
		global $wpdb;

		$class_instance = new WPSEO_Export_Keywords_Presenter_Double( array( 'post_title', 'post_url', 'seo_score', 'keywords', 'keywords_score' ), $wpdb );

		$fake_post = $this->factory->post->create( array( 'post_title' => 'fake post' ) );
		$fake_result = array(
			'ID' => var_export( $fake_post, true ),
			'post_title' => 'fake post',
			'seo_score' => null,
			'primary_keyword' => null,
			'primary_keyword_score' => null,
			'other_keywords' => null
		);

		$result = $class_instance->present( $fake_result );

		$this->assertEquals( $fake_post, $result['ID'] );
		$this->assertEquals( 'fake post', $result['post_title'] );
		$this->assertEquals( get_permalink( $fake_post ), $result['post_url'] );
		$this->assertEquals( 'na', $result['seo_score'] );
		$this->assertEquals( array(), $result['keywords'] );
		$this->assertEquals( array(), $result['keywords_score'] );
	}
}
