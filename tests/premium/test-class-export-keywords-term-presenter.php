<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Class WPSEO_Export_Keywords_Presenter_Double\
 *
 * A double for testing protected method.
 */
class WPSEO_Export_Keywords_Term_Presenter_Double extends WPSEO_Export_Keywords_Term_Presenter {
	public function return_validate_result( $result ) {
		return $this->validate_result( $result );
	}

	public function return_get_result_keywords( $result ) {
		return $this->get_result_keywords( $result );
	}

	public function return_get_result_keywords_score( $result ) {
		return $this->get_result_keywords_score( $result );
	}
}

class WPSEO_Export_Keywords_Term_Presenter_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests if validate_result works with expected input.
	 *
	 * @cover WPSEO_Export_Keywords_Term_Presenter::validate_result
	 */
	public function test_validate_result() {
		$class_instance = new WPSEO_Export_Keywords_Term_Presenter_Double( array( 'post_title' ) );

		$fake_result = array(
			'term_id' => '1',
			'name'    => 'fake post',
		);

		$this->assertTrue( $class_instance->return_validate_result( $fake_result ) );
	}

	/**
	 * Tests if validate_result works with bad input.
	 *
	 * @cover WPSEO_Export_Keywords_Term_Presenter::validate_result
	 */
	public function test_validate_input_false() {
		$class_instance = new WPSEO_Export_Keywords_Term_Presenter_Double( array( 'title' ) );

		$fake_result = array(
			'term_id' => '1',
			'name'    => true,
		);

		$this->assertFalse( $class_instance->return_validate_result( $fake_result ) );
		$this->assertFalse( $class_instance->return_validate_result( array() ) );
	}

	/**
	 * Tests the get_result_keywords function.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Presenter::get_result_keywords
	 */
	public function test_get_result_keywords() {
		$category = $this->factory->category->create( array( 'name' => 'test' ) );
		WPSEO_Taxonomy_Meta::set_values( $category, 'category', array(
			'wpseo_focuskw'       => 'keyword',
			'wpseo_linkdex'       => '60',
			'wpseo_content_score' => '30',
		) );

		$class_instance = new WPSEO_Export_Keywords_Term_Presenter_Double( array( 'title' ) );

		$fake_result = array(
			'ID'       => $category,
			'title'    => 'test',
			'taxonomy' => 'category',
		);
		$keywords    = $class_instance->return_get_result_keywords( $fake_result );

		$this->assertCount( 1, $keywords );
		$this->assertContains( 'keyword', $keywords );

		// There doesn't seem to be any way to unset values so just nuke the entire option.
		delete_option( WPSEO_Taxonomy_Meta::$name );
	}

	/**
	 * Tests the get_result_keywords_score function.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Presenter::get_result_keywords_score
	 */
	public function test_get_result_keywords_score() {
		$category = $this->factory->category->create( array( 'name' => 'test' ) );
		WPSEO_Taxonomy_Meta::set_values( $category, 'category', array(
			'wpseo_focuskw'       => 'keyword',
			'wpseo_linkdex'       => '60',
			'wpseo_content_score' => '30',
		) );

		$class_instance = new WPSEO_Export_Keywords_Term_Presenter_Double( array( 'title' ) );

		$fake_result    = array(
			'ID'       => $category,
			'title'    => 'test',
			'taxonomy' => 'category',
		);
		$keywords_score = $class_instance->return_get_result_keywords_score( $fake_result );


		$this->assertCount( 1, $keywords_score );
		$this->assertContains( 'OK', $keywords_score );

		// There doesn't seem to be any way to unset values so just nuke the entire option.
		delete_option( WPSEO_Taxonomy_Meta::$name );
	}

	/**
	 * Tests the present function.
	 *
	 * @covers WPSEO_Export_Keywords_Term_Presenter::present
	 */
	public function test_present() {
		$category = $this->factory->category->create( array( 'name' => 'test' ) );
		WPSEO_Taxonomy_Meta::set_values( $category, 'category', array(
			'wpseo_focuskw'       => 'keyword',
			'wpseo_linkdex'       => '60',
			'wpseo_content_score' => '30',
		) );

		$class_instance = new WPSEO_Export_Keywords_Term_Presenter_Double( array(
			'title',
			'url',
			'readability_score',
			'keywords',
			'keywords_score',
		) );

		$fake_result = array(
			'term_id'  => $category,
			'name'     => 'test',
			'taxonomy' => 'category',
		);
		$presented   = $class_instance->present( $fake_result );

		$this->assertEquals( 'test', $presented['title'] );
		$this->assertEquals( 'http://example.org/?cat=' . $category, $presented['url'] );
		$this->assertEquals( 'Needs improvement', $presented['readability_score'] );

		$this->assertCount( 1, $presented['keywords'] );
		$this->assertEquals( 'keyword', $presented['keywords'][0] );

		$this->assertCount( 1, $presented['keywords_score'] );
		$this->assertEquals( 'OK', $presented['keywords_score'][0] );

		// There doesn't seem to be any way to unset values so just nuke the entire option.
		delete_option( WPSEO_Taxonomy_Meta::$name );
	}
}
