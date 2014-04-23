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
	* @var int
	*/
	private $user_id = 0;

	/**
	* Provision tests
	*/
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_OpenGraph();

		// create admin user
		$this->user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		// create sample post
		$this->post_id = $this->factory->post->create(
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish',
				'post_author' => $this->user_id
			) 
		);

		// add category to post
		$this->category_id = wp_create_category( "WordPress SEO" );
		wp_set_post_categories( $this->post_id, array( $this->category_id ) );

		// fill global $post
		global $post;
		$post = $this->get_post( $this->post_id );

		// go to single post
		$this->go_to_post();
	}

	/**
	* Clean-up
	*/
	public function tearDown() {
		parent::tearDown();

		// delete post
		wp_delete_post( $this->post_id );

		// delete category
		wp_delete_category( $this->category_id );

		// delete author
		wp_delete_user( $this->user_id );

		// go back to home page
		$this->go_to_home();
	}

	/**
	* Test if options were properly fetched upon class instantiation.
	*/
	public function test_options_not_empty() {
		$this->assertNotEmpty( $this->class_instance->options );
	}

    /**
     * @covers WPSEO_OpenGraph::opengraph
     */
	public function test_opengraph() {
		$this->class_instance->opengraph();
		$this->assertEquals( 1, did_action( 'wpseo_opengraph' ) );
		ob_clean();
	}

    /**
     * @covers WPSEO_OpenGraph::og_tag
     */
	public function test_og_tag() {
		
		// there should be no output when $content is empty
		$this->assertFalse( $this->class_instance->og_tag( 'property', '' ) );
		$this->expectOutput( '' );	

		// true when $content is not empty
		$this->assertTrue( $this->class_instance->og_tag( 'property', 'content' ) );	
		$this->expectOutput( '<meta property="property" content="content" />' . "\n" );

		// test escaping
		$this->assertTrue( $this->class_instance->og_tag( 'property "with quotes"', 'content "with quotes"' ) );	
		$this->expectOutput( '<meta property="property &quot;with quotes&quot;" content="content &quot;with quotes&quot;" />' . "\n" );
	}

    /**
     * @covers WPSEO_OpenGraph::facebook_filter
     */
	public function test_facebook_filter() {
		
		$c = $this->class_instance;
		$result = $c->facebook_filter( array() );

		// test if values were filtered
		$this->assertArrayHasKey( 'http://ogp.me/ns#type', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#title', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#locale', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#description', $result );

		// test filter values
		$this->assertEquals( $result['http://ogp.me/ns#type'], $c->type( false ) );
		$this->assertEquals( $result['http://ogp.me/ns#title'], $c->og_title( false ) );
		$this->assertEquals( $result['http://ogp.me/ns#locale'], $c->locale( false ) );
		$this->assertEquals( $result['http://ogp.me/ns#description'], $c->description( false ) );
	}

    /**
     * @covers WPSEO_OpenGraph::add_opengraph_namespace
     */
	public function test_add_opengraph_namespace() {
		$c = $this->class_instance;
		$expected = ' prefix="og: http://ogp.me/ns#' . ( ( $c->options['fbadminapp'] != 0 || ( is_array( $c->options['fb_admins'] ) && $c->options['fb_admins'] !== array() ) ) ? ' fb: http://ogp.me/ns/fb#' : '' ) . '"';
		$this->assertEquals( $c->add_opengraph_namespace( '' ), $expected );
	}

    /**
     * @covers WPSEO_OpenGraph::article_author_facebook
     */
	public function test_article_author_facebook() {
		// on post page but facebook meta not set.
		$this->assertFalse( $this->class_instance->article_author_facebook() );

		// add facebook meta to post author
		$post = get_post( $this->post_id );
		$author = $post->post_author;
		add_user_meta( $author, 'facebook', 'facebook_author' );

		// test final output
		$this->assertTrue( $this->class_instance->article_author_facebook() );
		$this->expectOutput( '<meta property="article:author" content="facebook_author" />' . "\n" );

		// test not on singular page
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->article_author_facebook() );

		// go back to single post
		$this->go_to_post();
	}

    /**
     * @covers WPSEO_OpenGraph::website_facebook
     */
	public function test_website_facebook() {
		// option not set
		$this->assertFalse( $this->class_instance->website_facebook() );

		// set option
		$this->class_instance->options['facebook_site'] = 'http://facebook.com/mysite/';

		// test output
		$this->assertTrue( $this->class_instance->website_facebook() );
		$this->expectOutput( '<meta property="article:publisher" content="http://facebook.com/mysite/" />' . "\n" );
	}

    /**
     * @covers WPSEO_OpenGraph::site_owner
     */
	public function test_site_owner() {
		$this->assertFalse( $this->class_instance->site_owner() );

		// @todo
	}

    /**
     * @covers WPSEO_OpenGraph::og_title
     */
	public function test_og_title() {
		$expected_title = $this->class_instance->title( '' );
		$expected_html = '<meta property="og:title" content="'.$expected_title.'" />' . "\n";

		$this->assertTrue( $this->class_instance->og_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( $this->class_instance->og_title( false ), $expected_title );

	}

    /**
     * @covers WPSEO_OpenGraph::url
     */
	public function test_url() {
		$expected_url = get_permalink( $this->post_id );

		$this->assertTrue( $this->class_instance->url() );
		$this->expectOutput( '<meta property="og:url" content="' . $expected_url . '" />' . "\n" );
	}

    /**
     * @covers WPSEO_OpenGraph::locale
     */
	public function test_locale() {
		 global $locale;

		 $this->assertEquals( 'en_US', $this->class_instance->locale( false ) );

		 $locale = 'ca';
		 $this->assertEquals( 'ca_ES', $this->class_instance->locale( false ) );	

		 $locale = 'nl';
		 $this->assertEquals( 'nl_NL', $this->class_instance->locale( false ) );

		 $locale = 'nl_NL';
		 $this->assertEquals( 'nl_NL', $this->class_instance->locale( true ) );
		 $this->expectOutput( '<meta property="og:locale" content="nl_NL" />' . "\n" );
	}

    /**
     * @covers WPSEO_OpenGraph::type
     */
	public function test_type() {
		
		$this->go_to_home();
		$this->assertEquals( 'website', $this->class_instance->type( false ) );

		$this->go_to_category();
		$this->assertEquals( 'object', $this->class_instance->type( false ) );

		$this->go_to_post();
		$this->assertEquals( 'article', $this->class_instance->type( false ) );
	}

    /**
     * @covers WPSEO_OpenGraph::image_output
     */
	public function test_image_output() {
		$this->assertFalse( $this->class_instance->image_output( '' ) );

		$this->assertFalse( $this->class_instance->image_output('malformed-relative-url') );

		$img_url = home_url('absolute-image.jpg');

		// test with absolute image
		$this->assertTrue( $this->class_instance->image_output( $img_url ) );
		$this->expectOutput( '<meta property="og:image" content="' . $img_url . '" />' . "\n" );

		// do not output same image twice
		$this->assertFalse( $this->class_instance->image_output( $img_url ) );

		// test with relative image url
		$relative_img_url = '/relative-image.jpg';
		$absolute_img_url = home_url( $relative_img_url );
		$this->assertTrue( $this->class_instance->image_output( $relative_img_url ) );
		$this->expectOutput( '<meta property="og:image" content="' . $absolute_img_url . '" />' . "\n" );
	}

    /**
     * @covers WPSEO_OpenGraph::image
     */
	public function test_image() {

	}

    /**
     * @covers WPSEO_OpenGraph::description
     */
	public function test_description() {

	}

    /**
     * @covers WPSEO_OpenGraph::site_name
     */
	public function test_site_name() {

	}

    /**
     * @covers WPSEO_OpenGraph::tags
     */
	public function test_tags() {

		// no tags, should return false
		$this->assertFalse( $this->class_instance->tags() );
		
		// add tags to post
		wp_set_post_tags( $this->post_id, 'Tag1, Tag2' );
		$expected_tags = '<meta property="article:tag" content="Tag1" />' . "\n" . '<meta property="article:tag" content="Tag2" />' . "\n";
		
		// test again, this time with tags
		$this->assertTrue( $this->class_instance->tags() );
		$this->expectOutput( $expected_tags );

		// not singular, return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->tags() );

		// go back to post
		$this->go_to_post();
	}

    /**
     * @covers WPSEO_OpenGraph::category
     */
	public function test_category() {	

		// Test category
		$this->assertTrue( $this->class_instance->category() );
		$this->expectOutput( '<meta property="article:section" content="WordPress SEO" />' . "\n" );

		// not singular, should return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->category() );

		// go back to single post
		$this->go_to_post();
	}

    /**
     * @covers WPSEO_OpenGraph::publish_date
     */
	public function test_publish_date() {

		// not on singular, should return false
		$this->go_to_home();
		$this->assertFalse( $this->class_instance->publish_date() );

		// go back to post
		$this->go_to_post();

		// test published_time tags output
		$published_time = get_the_date( 'c' );
		$published_output = '<meta property="article:published_time" content="' . $published_time . '" />' . "\n";
		$this->assertTrue( $this->class_instance->publish_date() );	
		$this->expectOutput( $published_output );

		// modify post time
		global $post;
		$post = $this->get_post();
		$post->post_modified     = gmdate( 'Y-m-d H:i:s', time() + 1 );
		$post->post_modified_gmt = gmdate( 'Y-m-d H:i:s', ( time() + 1 + ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ) ) );
		
		// test modified tags output
		$modified_time = get_the_modified_date( 'c' );
		$modified_output = '<meta property="article:modified_time" content="' . $modified_time . '" />' . "\n" . '<meta property="og:updated_time" content="' . $modified_time . '" />' . "\n";
		$this->assertTrue( $this->class_instance->publish_date() );
		$this->expectOutput( $published_output . $modified_output );
	}

	/**
	 * Fake a request to a post page
	 */
	private function go_to_post() {
		$this->go_to( get_permalink( $this->post_id ) );
	}

	/**
	 * Fake a request to a category page
	 */
	private function go_to_category() {
		$this->go_to( get_category_link( $this->category_id ) );
	}

	/**
	 * @return null|WP_Post
	 */
	private function get_post() {
		global $post;
		$post = get_post( $this->post_id );
		return $post;
	}

}