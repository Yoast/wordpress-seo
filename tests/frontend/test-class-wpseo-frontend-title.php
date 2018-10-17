<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
final class WPSEO_Frontend_Title_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Tests expected output from get content title.
	 *
	 * @covers WPSEO_Frontend::get_content_title
	 */
	public function test_get_content_title() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test title according to format.
		$expected_title = self::$class_instance->get_title_from_options( 'title-post', get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );

		// Test explicit post title.
		$explicit_title = 'WPSEO Post Title %%sitename%%';
		WPSEO_Meta::set_value( 'title', $explicit_title, $post_id );

		$post           = get_post( $post_id );
		$expected_title = wpseo_replace_vars( $explicit_title, $post );

		$this->assertEquals( $expected_title, self::$class_instance->get_content_title() );
	}

	/**
	 * Tests expected output from taxonomy title.
	 *
	 * @covers WPSEO_Frontend::get_taxonomy_title
	 */
	public function test_get_taxonomy_title() {
		// Create and go to cat archive.
		$category_id = wp_create_category( 'Category Name' );
		flush_rewrite_rules();

		$this->go_to( get_category_link( $category_id ) );

		// Test title according to format.
		$expected_title = self::$class_instance->get_title_from_options( 'title-tax-category', (array) get_queried_object() );
		$this->assertEquals( $expected_title, self::$class_instance->get_taxonomy_title() );

		// @todo Add test for an explicit wpseo title format.
		// We need an easy way to set taxonomy meta though...
	}

	/**
	 * Tests expected output for author title.
	 *
	 * @covers WPSEO_Frontend::get_author_title
	 */
	public function test_get_author_title() {
		// Create and go to author.
		$user_id = $this->factory->user->create();
		$this->go_to( get_author_posts_url( $user_id ) );

		// Test general author title.
		$expected_title = self::$class_instance->get_title_from_options( 'title-author-wpseo' );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );

		// Add explicit title to author meta.
		$explicit_title = 'WPSEO Author Title %%sitename%%';
		add_user_meta( $user_id, 'wpseo_title', $explicit_title );

		// Test explicit title.
		$expected_title = wpseo_replace_vars( 'WPSEO Author Title %%sitename%%', array() );
		$this->assertEquals( $expected_title, self::$class_instance->get_author_title() );
	}

	/**
	 * Tests expected results when getting the title from options.
	 *
	 * @covers WPSEO_Frontend::get_title_from_options
	 */
	public function test_get_title_from_options() {
		// Should return an empty string.
		$this->assertEmpty( self::$class_instance->get_title_from_options( '__not-existing-index' ) );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$var_source     = (array) get_queried_object();
		$expected_title = wpseo_replace_vars( '%%title%% %%sep%% %%sitename%%', $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( '__not-existing-index', $var_source ) );

		// Test with an option that exists.
		$index          = 'title-post';
		$expected_title = wpseo_replace_vars( WPSEO_Options::get( $index ), $var_source );
		$this->assertEquals( $expected_title, self::$class_instance->get_title_from_options( $index, $var_source ) );
	}

	/**
	 * Tests if pagination is added to the title.
	 *
	 * @covers WPSEO_Frontend::add_paging_to_title()
	 */
	public function test_add_paging_to_title() {
		$input = 'Initial title';

		// Test without paged query var set.
		$this->assertEquals( $input, self::$class_instance->add_paging_to_title( '', '', $input ) );

		// Test with paged set.
		set_query_var( 'paged', 2 );
		global $wp_query;
		$expected = self::$class_instance->add_to_title( '', '', $input, $wp_query->query_vars['paged'] . '/' . $wp_query->max_num_pages );
		$this->assertEquals( $expected, self::$class_instance->add_paging_to_title( '', '', $input ) );
	}

	/**
	 * Tests the add tot title behaviour.
	 *
	 * @covers WPSEO_Frontend::add_to_title()
	 */
	public function test_add_to_title() {
		$title      = 'Title';
		$sep        = ' >> ';
		$title_part = 'Title Part';

		$expected = $title . $sep . $title_part;
		$this->assertEquals( $expected, self::$class_instance->add_to_title( $sep, 'right', $title, $title_part ) );

		$expected = $title_part . $sep . $title;
		$this->assertEquals( $expected, self::$class_instance->add_to_title( $sep, 'left', $title, $title_part ) );
	}

	/**
	 * Tests post type archive title.
	 *
	 * @covers WPSEO_Frontend::get_post_type_archive_title()
	 */
	public function test_get_post_type_archive_title() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_queried_post_type', 'get_title_from_options' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'post_type' ) );

		$instance->expects( $this->once() )
			->method( 'get_title_from_options' )
			->with( 'title-ptarchive-post_type' )
			->will( $this->returnValue( 'my title' ) );

		/** @var WPSEO_Frontend_Double $instance */
		$this->assertEquals( 'my title', $instance->get_post_type_archive_title( '', '' ) );
	}

	/**
	 * Tests if the post type archive has a menu title fallback.
	 *
	 * @covers WPSEO_Frontend::get_post_type_archive_title()
	 */
	public function test_get_post_type_archive_title_menu_title_fallback() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_queried_post_type', 'get_title_from_options', 'get_default_title' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'post_type' ) );

		$instance->expects( $this->once() )
			->method( 'get_title_from_options' )
			->with( 'title-ptarchive-post_type' )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->once() )
			->method( 'get_default_title' )
			->with( '1', '2', '3' )
			->will( $this->returnValue( '123' ) );

		$GLOBALS['wp_post_types'] = array(
			'post_type' => new WP_Post_Type( 'post_type', array( 'labels' => array( 'menu_name' => '3' ) ) ),
		);

		$this->assertEquals( '123', $instance->get_post_type_archive_title( '1', '2' ) );
	}

	/**
	 * Tests if the post type archive has a post type name fallback.
	 *
	 * @covers WPSEO_Frontend::get_post_type_archive_title()
	 */
	public function test_get_post_type_archive_title_name_fallback() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_queried_post_type', 'get_title_from_options', 'get_default_title' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'post_type' ) );

		$instance->expects( $this->once() )
			->method( 'get_title_from_options' )
			->with( 'title-ptarchive-post_type' )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->once() )
			->method( 'get_default_title' )
			->with( '1', '2', '4' )
			->will( $this->returnValue( '124' ) );

		$GLOBALS['wp_post_types'] = array(
			'post_type' => new WP_Post_Type( 'post_type', array( 'labels' => array( 'name' => '4' ) ) ),
		);

		$this->assertEquals( '124', $instance->get_post_type_archive_title( '1', '2' ) );
	}

	/**
	 * Tests if the post type archive title falls back on post type name.
	 *
	 * @covers WPSEO_Frontend::get_post_type_archive_title()
	 */
	public function test_get_post_type_archive_title_empty_fallback() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_queried_post_type', 'get_title_from_options', 'get_default_title' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_queried_post_type' )
			->will( $this->returnValue( 'post_type' ) );

		$instance->expects( $this->once() )
			->method( 'get_title_from_options' )
			->with( 'title-ptarchive-post_type' )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->once() )
			->method( 'get_default_title' )
			->with( '1', '2', 'post_type' )
			->will( $this->returnValue( '12post_type' ) );

		$GLOBALS['wp_post_types'] = array(
			'post_type' => new WP_Post_Type( 'post_type', array( 'labels' => array( 'menu_name' => null ) ) ),
		);

		$this->assertEquals( '12post_type', $instance->get_post_type_archive_title( '1', '2' ) );
	}

	/**
	 * Tests if the seo title is a 404 title when an invalid object is presented.
	 *
	 * @covers WPSEO_Frontend::get_seo_title()
	 */
	public function test_get_seo_title_no_valid_object() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_title_from_options' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_title_from_options' )
			->with( 'title-404-wpseo' )
			->will( $this->returnValue( '404 title' ) );

		$this->assertEquals( '404 title', $instance->get_seo_title( '' ) );
	}

	/**
	 * Tests for normal behaviour of the seo title with expected input.
	 *
	 * @covers WPSEO_Frontend::get_seo_title()
	 */
	public function test_get_seo_title_with_valid_object() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'replace_vars' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_seo_meta_value' )
			->with( 'title', 1 )
			->will( $this->returnValue( '' ) );

		$instance->expects( $this->never() )
			->method( 'replace_vars' );

		$this->assertEquals( '', $instance->get_seo_title( (object) array( 'ID' => 1 ) ) );
	}

	/**
	 * Test if seo title applies replace vars as expected.
	 *
	 * @covers WPSEO_Frontend::get_seo_title()
	 */
	public function test_get_seo_title_use_replace_vars() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'replace_vars' ) )
			->getMock();

		$instance->expects( $this->once() )
			->method( 'get_seo_meta_value' )
			->with( 'title', 1 )
			->will( $this->returnValue( 'a title' ) );

		$object = (object) array( 'ID' => 1 );

		$instance->expects( $this->once() )
			->method( 'replace_vars' )
			->with( 'a title', $object )
			->will( $this->returnValue( 'a title replaced' ) );

		$this->assertEquals( 'a title replaced', $instance->get_seo_title( $object ) );
	}

	/**
	 * Tests if the global queried object is being used with no supplied input.
	 *
	 * @covers WPSEO_Frontend::get_seo_title()
	 */
	public function test_get_seo_title_use_queried_object() {
		$instance = $this->getMockBuilder( 'WPSEO_Frontend_Double' )
			->setMethods( array( 'get_seo_meta_value', 'replace_vars' ) )
			->getMock();

		$wp_query = $this->getMockBuilder( 'WP_Query' )
			->setMethods( array( 'get_queried_object' ) )
			->getMock();

		$object = (object) array( 'ID' => 1 );

		$wp_query->expects( $this->once() )
			->method( 'get_queried_object' )
			->will( $this->returnValue( $object ) );

		$GLOBALS['wp_query'] = $wp_query;

		$instance->expects( $this->once() )
			->method( 'get_seo_meta_value' )
			->with( 'title', 1 )
			->will( $this->returnValue( 'a title' ) );

		$instance->expects( $this->once() )
			->method( 'replace_vars' )
			->with( 'a title', $object )
			->will( $this->returnValue( 'a title replaced' ) );

		$this->assertEquals( 'a title replaced', $instance->get_seo_title() );
	}
}
