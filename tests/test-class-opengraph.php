<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
 */

class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_OpenGraph
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_OpenGraph;
	}

	/**
	 * Provision tests
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();

		// start each test on the home page
		$this->go_to_home();
	}

	public function tearDown() {
		ob_clean();
	}

	/**
	 * Test if options were properly fetched upon class instantiation.
	 */
	public function test_options_not_empty() {
		$this->assertNotEmpty( self::$class_instance->options );
	}

	/**
	 * @covers WPSEO_OpenGraph::opengraph
	 */
	public function test_opengraph() {
		self::$class_instance->opengraph();
		$this->assertEquals( 1, did_action( 'wpseo_opengraph' ) );
		ob_clean();
	}

	/**
	 * @covers WPSEO_OpenGraph::og_tag
	 */
	public function test_og_tag() {

		// there should be no output when $content is empty
		$this->assertFalse( self::$class_instance->og_tag( 'property', '' ) );
		$this->expectOutput( '' );

		// true when $content is not empty
		$this->assertTrue( self::$class_instance->og_tag( 'property', 'content' ) );
		$this->expectOutput( '<meta property="property" content="content" />' . "\n" );

		// test escaping
		$this->assertTrue( self::$class_instance->og_tag( 'property "with quotes"', 'content "with quotes"' ) );
		$this->expectOutput( '<meta property="property &quot;with quotes&quot;" content="content &quot;with quotes&quot;" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::facebook_filter
	 */
	public function test_facebook_filter() {

		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$c      = self::$class_instance;
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
		$c        = self::$class_instance;
		$expected = ' prefix="og: http://ogp.me/ns#' . ( ( $c->options['fbadminapp'] != 0 || ( is_array( $c->options['fb_admins'] ) && $c->options['fb_admins'] !== array() ) ) ? ' fb: http://ogp.me/ns/fb#' : '' ) . '"';
		$this->assertEquals( $c->add_opengraph_namespace( '' ), $expected );
	}

	/**
	 * @covers WPSEO_OpenGraph::article_author_facebook
	 */
	public function test_article_author_facebook() {

		// test not on singular page
		$this->assertFalse( self::$class_instance->article_author_facebook() );

		// create post with author
		$author_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id   = $this->factory->post->create( array( 'post_author' => $author_id ) );
		$this->go_to( get_permalink( $post_id ) );

		// on post page but facebook meta not set.
		$this->assertFalse( self::$class_instance->article_author_facebook() );

		// add facebook meta to post author
		$post   = get_post( $post_id );
		$author = $post->post_author;
		add_user_meta( $author, 'facebook', 'facebook_author' );

		// test final output
		$this->assertTrue( self::$class_instance->article_author_facebook() );
		$this->expectOutput( '<meta property="article:author" content="facebook_author" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::website_facebook
	 */
	public function test_website_facebook() {
		// option not set
		$this->assertFalse( self::$class_instance->website_facebook() );

		// set option
		self::$class_instance->options['facebook_site'] = 'http://facebook.com/mysite/';

		// test output
		$this->assertTrue( self::$class_instance->website_facebook() );
		$this->expectOutput( '<meta property="article:publisher" content="http://facebook.com/mysite/" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::site_owner
	 */
	public function test_site_owner() {
		$this->assertFalse( self::$class_instance->site_owner() );

		// @todo
	}

	/**
	 * @covers WPSEO_OpenGraph::og_title
	 */
	public function test_og_title() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected_title = WPSEO_Frontend::get_instance()->title( '' );
		$expected_html  = '<meta property="og:title" content="' . $expected_title . '" />' . "\n";

		$this->assertTrue( self::$class_instance->og_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( self::$class_instance->og_title( false ), $expected_title );

	}

	/**
	 * @covers WPSEO_OpenGraph::url
	 */
	public function test_url() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$url     = get_permalink( $post_id );
		$this->go_to( $url );
		$expected_url = $url;

		$this->assertTrue( self::$class_instance->url() );
		$this->expectOutput( '<meta property="og:url" content="' . $expected_url . '" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::locale
	 */
	public function test_locale() {
		global $locale;

		$this->assertEquals( 'en_US', self::$class_instance->locale( false ) );

		$locale = 'ca';
		$this->assertEquals( 'ca_ES', self::$class_instance->locale( false ) );

		$locale = 'nl';
		$this->assertEquals( 'nl_NL', self::$class_instance->locale( false ) );

		$locale = 'nl_NL';
		$this->assertEquals( 'nl_NL', self::$class_instance->locale( true ) );
		$this->expectOutput( '<meta property="og:locale" content="nl_NL" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::type
	 */
	public function test_type() {
		$this->assertEquals( 'website', self::$class_instance->type( false ) );

		$category_id = wp_create_category( 'WordPress SEO' );
		$this->go_to( get_category_link( $category_id ) );
		$this->assertEquals( 'object', self::$class_instance->type( false ) );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertEquals( 'article', self::$class_instance->type( false ) );
	}

	/**
	 * @covers WPSEO_OpenGraph::image_output
	 */
	public function test_image_output() {
		$this->assertFalse( self::$class_instance->image_output( '' ) );

		$this->assertFalse( self::$class_instance->image_output( 'malformed-relative-url' ) );

		$img_url = home_url( 'absolute-image.jpg' );

		// test with absolute image
		$this->assertTrue( self::$class_instance->image_output( $img_url ) );
		$this->expectOutput( '<meta property="og:image" content="' . $img_url . '" />' . "\n" );

		// do not output same image twice
		$this->assertFalse( self::$class_instance->image_output( $img_url ) );

		// test with relative image url
		$relative_img_url = '/relative-image.jpg';
		$absolute_img_url = home_url( $relative_img_url );
		$this->assertTrue( self::$class_instance->image_output( $relative_img_url ) );
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
	public function test_description_frontpage() {

		$this->go_to_home();

		$expected_frontpage_description = self::$class_instance->description( false );

		$this->assertEquals( '', $expected_frontpage_description );

	}

	/**
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_description_single_post_opengraph_description() {
		$expected_opengraph_description = 'This is with a opengraph-description';

		// Creates the post
		$post_id = $this->factory->post->create();

		$this->go_to( get_permalink( $post_id ) );

		// Checking opengraph-description and after obtaining its value, reset the meta value for it
		WPSEO_Meta::set_value( 'opengraph-description', $expected_opengraph_description, $post_id );
		$opengraph_description = self::$class_instance->description( false );
		WPSEO_Meta::set_value( 'opengraph-description', '', $post_id );
		$this->assertEquals( $expected_opengraph_description, $opengraph_description );
	}

	public function test_description_single_post_metadesc() {
		$expected_meta_description = 'This is with a meta-description';

		// Creates the post
		$post_id = $this->factory->post->create();

		WPSEO_Meta::set_value( 'metadesc', $expected_meta_description, $post_id );

		$this->go_to( get_permalink( $post_id ) );

		// Checking meta-description and after obtaining its value, reset the meta value for it
		$meta_description = self::$class_instance->description( false );
		$this->assertEquals( $expected_meta_description, $meta_description );
	}

	public function test_description_single_post_excerpt() {
		// Creates the post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Checking with the excerpt
		$expected = get_the_excerpt();
		$excerpt = self::$class_instance->description( false );

		$this->assertEquals( $expected, $excerpt );
	}

	/**
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_description_category() {

		$expected_meta_description = '';

		$category_id = wp_create_category( 'WordPress SEO' );
		$this->go_to( get_category_link( $category_id ) );

		// Checking meta-description and after obtaining its value, reset the meta value for it
		$meta_description = self::$class_instance->description( false );
		$this->assertEquals( $expected_meta_description, $meta_description );

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

		// not singular, return false
		$this->assertFalse( self::$class_instance->tags() );

		// create post, without tags
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// no tags, should return false
		$this->assertFalse( self::$class_instance->tags() );

		// add tags to post
		wp_set_post_tags( $post_id, 'Tag1, Tag2' );
		$expected_tags = '<meta property="article:tag" content="Tag1,Tag2" />' . "\n";

		// test again, this time with tags
		$this->assertTrue( self::$class_instance->tags() );
		$this->expectOutput( $expected_tags );
	}

	/**
	 * @covers WPSEO_OpenGraph::category
	 */
	public function test_category() {

		// not singular, should return false
		$this->assertFalse( self::$class_instance->category() );

		// Create post in category, go to post.
		$category_id = wp_create_category( 'Category Name' );
		$post_id     = $this->factory->post->create( array( 'post_category' => array( $category_id ) ) );
		$this->go_to( get_permalink( $post_id ) );

		$this->assertTrue( self::$class_instance->category() );
		$this->expectOutput( '<meta property="article:section" content="Category Name" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::publish_date
	 */
	public function test_publish_date() {

		// not on singular, should return false
		$this->assertFalse( self::$class_instance->publish_date() );

		// create post, without tags
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test published_time tags output
		$published_time   = get_the_date( 'c' );
		$published_output = '<meta property="article:published_time" content="' . $published_time . '" />' . "\n";
		$this->assertTrue( self::$class_instance->publish_date() );
		$this->expectOutput( $published_output );

		// modify post time
		global $post;
		$post                    = get_post( $post_id );
		$post->post_modified     = gmdate( 'Y-m-d H:i:s', ( time() + 1 ) );
		$post->post_modified_gmt = gmdate( 'Y-m-d H:i:s', ( time() + 1 + ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ) ) );

		// test modified tags output
		$modified_time   = get_the_modified_date( 'c' );
		$modified_output = '<meta property="article:modified_time" content="' . $modified_time . '" />' . "\n" . '<meta property="og:updated_time" content="' . $modified_time . '" />' . "\n";
		$this->assertTrue( self::$class_instance->publish_date() );
		$this->expectOutput( $published_output . $modified_output );
	}

}