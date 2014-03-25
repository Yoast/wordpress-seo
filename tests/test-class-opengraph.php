<?php

class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/**
	* @var WPSEO_OpenGraph
	*/ 
	private $class_instance;

	/**
	* @var int
	*/
	private $post_id = 0;

	/**
	* @var int
	*/ 
	private $category_id = 0;

	/**
	* Provision tests
	*/
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_OpenGraph();

		$author_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		$this->post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish',
				'post_author' => $author_id
			) 
		);

		$this->category_id = wp_create_category( "WordPress SEO" );
		wp_set_post_categories( $this->post_id, array( $this->category_id ) );

		$this->get_post( $this->post_id );

		// go to single post
		$this->go_to_post();
	}

	/**
	* Test if options were properly fetched upon class instantiation.
	*/
	public function test_options_not_empty() {
		$this->assertNotEmpty( $this->class_instance->options );
	}

	/**
	* Test the output of the WPSEO_OpenGraph_Test->og_tag() method.
	*/ 
	public function test_og_tag() {
		
		// there should be no output when $content is empty
		$this->expectOutputString( '' );
		$this->assertFalse( $this->class_instance->og_tag( 'property', '' ) );	

		// true when $content is not empty
		$this->expectOutputString( '<meta property="property" content="content" />' . "\n" );
		$this->assertTrue( $this->class_instance->og_tag( 'property', 'content' ) );	
		ob_clean();

		// test escaping
		$this->expectOutputString( '<meta property="property &quot;with quotes&quot;" content="content &quot;with quotes&quot;" />' . "\n" );
		$this->assertTrue( $this->class_instance->og_tag( 'property "with quotes"', 'content "with quotes"' ) );	
		
	}

	/**
	* Tests the article_author_facebook method
	*/
	public function test_article_author_facebook() {
		// on post page but facebook meta not set.
		$this->assertFalse( $this->class_instance->article_author_facebook() );

		// add facebook meta to post author
		$post = get_post( $this->post_id );
		$author = $post->post_author;
		add_user_meta( $author, 'facebook', 'facebook_author' );

		// test final output
		$this->expectOutputString( '<meta property="article:author" content="facebook_author" />' . "\n" );
		$this->assertTrue( $this->class_instance->article_author_facebook() );

		// test not on singular page
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->article_author_facebook() );

		// go back to single post
		$this->go_to_post();
	}

	public function test_website_facebook() {
		// option not set
		$this->assertFalse( $this->class_instance->website_facebook() );

		// set option
		$this->class_instance->options['facebook_site'] = 'http://facebook.com/mysite/';

		// test output
		$this->expectOutputString( '<meta property="article:publisher" content="http://facebook.com/mysite/" />' . "\n" );
		$this->assertTrue( $this->class_instance->website_facebook() );
	}

	public function test_site_owner() {
		$this->assertFalse( $this->class_instance->site_owner() );
	}

	public function test_og_title() {
		$expected_title = "Sample Post - Test Blog";
		$expected_html = '<meta property="og:title" content="'.$expected_title.'" />' . "\n";

		$this->expectOutputString( $expected_html );
		$this->assertTrue( $this->class_instance->og_title() );

		$this->assertEquals( $this->class_instance->og_title( false ), $expected_title );

	}

	public function test_url() {
		$expected_url = get_permalink( $this->post_id );

		$this->expectOutputString( '<meta property="og:url" content="' . $expected_url . '" />' . "\n" );
		$this->assertTrue( $this->class_instance->url() );
	}

	public function test_type() {
		
		$this->go_to_home();
		$this->assertEquals( 'website', $this->class_instance->type( false ) );

		$this->go_to_category();
		$this->assertEquals( 'object', $this->class_instance->type( false ) );

		$this->go_to_post();
		$this->assertEquals( 'article', $this->class_instance->type( false ) );
	}

	public function test_image_output() {
		$this->assertFalse( $this->class_instance->image_output( '' ) );

		$this->assertFalse( $this->class_instance->image_output('malformed-relative-url') );

		$img_url = home_url('absolute-image.jpg');

		// test with absolute image
		$this->expectOutputString( '<meta property="og:image" content="' . $img_url . '" />' . "\n" );
		$this->assertTrue( $this->class_instance->image_output( $img_url ) );

		// do not output same image twice
		$this->assertFalse( $this->class_instance->image_output( $img_url ) );

		// test with relative image url
		ob_clean();
		$relative_img_url = '/relative-image.jpg';
		$absolute_img_url = home_url( $relative_img_url );
		$this->expectOutputString( '<meta property="og:image" content="' . $absolute_img_url . '" />' . "\n" );
		$this->assertTrue( $this->class_instance->image_output( $relative_img_url ) );
	}

	public function test_tags() {

		// no tags, should return false
		$this->assertFalse( $this->class_instance->tags() );
		
		// add tags to post
		wp_set_post_tags( $this->post_id, 'Tag1, Tag2' );
		$expected_tags = '<meta property="article:tag" content="Tag1" />' . "\n" . '<meta property="article:tag" content="Tag2" />' . "\n";
		
		// test again, this time with tags
		$this->expectOutputString( $expected_tags );
		$this->assertTrue( $this->class_instance->tags() );

		// not singular, return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->tags() );

		// go back to post
		$this->go_to_post();
	}

	public function test_category() {	

		// Test category
		$this->expectOutputString( '<meta property="article:section" content="WordPress SEO" />' . "\n" );
		$this->assertTrue( $this->class_instance->category() );

		// not singular, should return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->category() );

		// go back to single post
		$this->go_to_post();
	}

	public function test_publish_date() {

		// not on singular, should return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->publish_date() );

		// go back to post
		$this->go_to_post();

		// test published_time tags output
		$published_time = get_the_date( 'c' );
		$published_output = '<meta property="article:published_time" content="' . $published_time . '" />' . "\n";
		$this->expectOutputString( $published_output );
		$this->assertTrue( $this->class_instance->publish_date() );	

		ob_clean();

		// modify post time
		global $post;
		$post = $this->get_post();
		$post->post_modified     = gmdate( 'Y-m-d H:i:s', time() + 1 );
		$post->post_modified_gmt = gmdate( 'Y-m-d H:i:s', ( time() + 1 + ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ) ) );
		
		// test modified tags output
		$modified_time = get_the_modified_date( 'c' );
		$modified_output = '<meta property="article:modified_time" content="' . $modified_time . '" />' . "\n" . '<meta property="og:updated_time" content="' . $modified_time . '" />' . "\n";
		$this->expectOutputString( $published_output . $modified_output );
		$this->assertTrue( $this->class_instance->publish_date() );

	}

	private function go_to_home() {
		$this->go_to( home_url() );
	}

	private function go_to_post() {
		$this->go_to( get_permalink( $this->post_id ) );
	}

	private function go_to_category() {
		$this->go_to( get_category_link( $this->category_id ) );
	}

	private function get_post() {
		global $post;
		$post = get_post( $this->post_id );
		return $post;
	}

}