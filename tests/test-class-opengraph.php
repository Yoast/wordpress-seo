<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * OpenGraph tests
 */
class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_OpenGraph */
	private static $class_instance;

	/**
	 * Set up class instance
	 */
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

	/**
	 * Clean output buffer after each test
	 */
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
	 * Test if the function og_tag gets called when there is a front page image
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_front_page_image() {
		$stub = $this->getMock( 'WPSEO_OpenGraph', array( 'og_tag') );

		$stub->options = array(
			'og_frontpage_image' => get_site_url() . '/wp-content/uploads/2015/01/iphone5_ios7-300x198.jpg',
		);

		$stub
			->expects( $this->once() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Test if the function og_tag does not get called when there is no front page image
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_NO_image() {
		$stub = $this->getMock( 'WPSEO_OpenGraph', array( 'og_tag') );

		$stub
			->expects( $this->never() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Test if the opengraph-image (Facebook Image) is added to opengraph
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_and_HAS_open_graph_image() {
		$post_id   = $this->factory->post->create();
		$image = get_site_url() . '/wp-content/plugins/wordpress-seo/tests/assets/small.png';

		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'opengraph-image', $image, $post_id );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_contents();

		ob_end_clean();

		$expected_output = '<meta property="og:image" content="' . $image . '" />';

		$this->assertContains( $expected_output, $output );
	}

	/**
	 * Test if the content image does not get added to opengraph when there is an opengraph-image (Facebook Image)
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_and_HAS_open_graph_image_AND_HAS_content_images() {
		$post_id = $this->factory->post->create(
			array(
				'post_content' => '<img class="alignnone size-medium wp-image-490" src="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests/yoast.png" />'
			)
		);

		$image = get_site_url() . '/wp-content/plugins/wordpress-seo/tests/assets/small.png';

		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'opengraph-image', $image, $post_id );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_contents();

		ob_end_clean();

		$expected_output = '<meta property="og:image" content="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests/yoast.png" />';

		$this->assertNotContains( $expected_output, $output );
	}

	/**
	 * Test if featured image does not get added to opengraph when the image is too small.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_AND_HAS_featured_image_AND_HAS_WRONG_size() {
		$post_id   = $this->factory->post->create();
		$image     = '/assets/small.png';
		$attach_id = $this->create_featured_image( $image, $post_id );

		update_post_meta( $post_id, '_thumbnail_id', $attach_id );

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_contents();

		ob_end_clean();

		$expected_output = '<meta property="og:image" content="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests' . $image . '" />';

		$this->assertNotContains( $expected_output, $output );
	}

	/**
	 * Test if featured image gets added to opengraph when it is the correct size.
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_AND_HAS_featured_image_AND_HAS_RIGHT_size() {
		$post_id   = $this->factory->post->create();
		$image     = '/assets/yoast.png';
		$attach_id = $this->create_featured_image( $image, $post_id );

		update_post_meta( $post_id, '_thumbnail_id', $attach_id );

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_contents();

		ob_end_clean();

		$expected_output = '<meta property="og:image" content="' . get_site_url() . '/wp-content/uploads/' . WP_PLUGIN_DIR . '/wordpress-seo/tests' . $image . '" />';

		$this->assertContains( $expected_output, $output );
	}

	/**
	 * Test if image in content is added to open graph
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_get_content_image() {
		$post_id = $this->factory->post->create(
			array(
				'post_content' => '<img class="alignnone size-medium wp-image-490" src="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests/yoast.png" />'
			)
		);

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_contents();

		ob_end_clean();

		$expected_output = '<meta property="og:image" content="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests/yoast.png" />';

		$this->assertContains( $expected_output, $output );
	}

	/**
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_description_frontpage() {

		$this->go_to_home();

		$expected_frontpage_description = self::$class_instance->description( false );

		$this->assertEquals( get_bloginfo( 'description' ), $expected_frontpage_description );

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

	/**
	 * Test meta description.
	 */
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

	/**
	 * Test description from excerpt.
	 */
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
		// TODO empty site name test
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

	/**
	 * @param string  $image   path
	 * @param integer $post_id
	 *
	 * @return int
	 */
	private function create_featured_image( $image, $post_id ) {
		// Create the attachment
		$featured_image = dirname( __FILE__ ) . $image;
		$filetype       = wp_check_filetype( basename( $featured_image ), null );

		// Get the path to the upload directory.
		$wp_upload_dir  = wp_upload_dir();

		$attach_id = wp_insert_attachment( array(
			'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $featured_image ) ),
			'post_content'   => '',
			'guid'           => $wp_upload_dir['url'] . '/' . basename( $featured_image ),
			'post_mime_type' => $filetype['type'],
			'post_status'    => 'inherit',
		), $featured_image, $post_id );

		// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
		require_once( ABSPATH . 'wp-admin/includes/image.php' );

		// Generate the metadata for the attachment, and update the database record.
		$attach_data = wp_generate_attachment_metadata( $attach_id, $featured_image );
		wp_update_attachment_metadata( $attach_id, $attach_data );

		return $attach_id;
	}

}