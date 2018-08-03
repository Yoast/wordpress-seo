<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * OpenGraph tests
 *
 * @group OpenGraph
 */
class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_OpenGraph */
	private static $class_instance;

	/**
	 * Set up class instance.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_OpenGraph();
	}

	/**
	 * Provision tests.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();
		remove_all_actions( 'wpseo_opengraph' );

		// Start each test on the home page.
		$this->go_to_home();
	}

	/**
	 * Clean output buffer after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		ob_clean();
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

		// There should be no output when $content is empty.
		$this->assertFalse( self::$class_instance->og_tag( 'property', '' ) );
		$this->expectOutput( '' );

		// Expect true when $content is not empty.
		$this->assertTrue( self::$class_instance->og_tag( 'property', 'content' ) );
		$this->expectOutput( '<meta property="property" content="content" />' . "\n" );

		// Test escaping.
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

		// Test if values were filtered.
		$this->assertArrayHasKey( 'http://ogp.me/ns#type', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#title', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#locale', $result );
		$this->assertArrayHasKey( 'http://ogp.me/ns#description', $result );

		// Test filter values.
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
		$expected = ' prefix="og: http://ogp.me/ns#"';
		$this->assertEquals( $c->add_opengraph_namespace( '' ), $expected );
	}

	/**
	 * @covers WPSEO_OpenGraph::article_author_facebook
	 */
	public function test_article_author_facebook() {

		// Test not on singular page.
		$this->assertFalse( self::$class_instance->article_author_facebook() );

		// Create post with author.
		$author_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id   = $this->factory->post->create( array( 'post_author' => $author_id ) );
		$this->go_to( get_permalink( $post_id ) );

		// On post page but facebook meta not set.
		$this->assertFalse( self::$class_instance->article_author_facebook() );

		// Add facebook meta to post author.
		$post   = get_post( $post_id );
		$author = $post->post_author;
		add_user_meta( $author, 'facebook', 'facebook_author' );

		// Test final output.
		$this->assertTrue( self::$class_instance->article_author_facebook() );
		$this->expectOutput( '<meta property="article:author" content="facebook_author" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::website_facebook
	 */
	public function test_website_facebook() {
		// Option not set.
		$this->assertFalse( self::$class_instance->website_facebook() );

		// Set option.
		WPSEO_Options::set( 'facebook_site', 'http://facebook.com/mysite/' );

		// Test home output.
		$this->go_to_home();
		$this->assertFalse( self::$class_instance->website_facebook() );

		// Test singular output.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertTrue( self::$class_instance->website_facebook() );
		$this->expectOutput( '<meta property="article:publisher" content="http://facebook.com/mysite/" />' . "\n" );
	}

	/**
	 * @covers WPSEO_OpenGraph::og_title
	 */
	public function test_og_title() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected_title = WPSEO_Frontend::get_instance()->title( '' );
		$expected_html  = '<meta property="og:title" content="' . $expected_title . '" />' . "\n";

		$this->assertTrue( self::$class_instance->og_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( self::$class_instance->og_title( false ), $expected_title );
	}

	/**
	 * @covers WPSEO_OpenGraph::og_title
	 */
	public function test_og_title_with_variables() {
		$expected_title = 'Test title';
		// Create and go to post.
		$post_id = $this->factory->post->create();
		wp_update_post( array(
			'ID'         => $post_id,
			'post_title' => $expected_title,
		) );
		WPSEO_Meta::set_value( 'opengraph-title', '%%title%%', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$expected_html  = '<meta property="og:title" content="' . $expected_title . '" />' . "\n";

		$this->assertTrue( self::$class_instance->og_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( self::$class_instance->og_title( false ), $expected_title );
	}

	/**
	 * @covers WPSEO_OpenGraph::url
	 */
	public function test_url() {

		// Create and go to post.
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

		$category_id = wp_create_category( 'Yoast SEO' );
		$this->go_to( get_category_link( $category_id ) );
		$this->assertEquals( 'object', self::$class_instance->type( false ) );

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );
		$this->assertEquals( 'article', self::$class_instance->type( false ) );
	}

	/**
	 * Test if the function og_tag gets called when there is a front page image.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_front_page_image() {

		$stub =
			$this
				->getMockBuilder( 'WPSEO_OpenGraph' )
				->setMethods( array( 'og_tag' ) )
				->getMock();

		WPSEO_Options::set( 'og_frontpage_image', get_site_url() . '/wp-content/uploads/2015/01/iphone5_ios7-300x198.jpg' );

		$stub
			->expects( $this->once() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Test if the function og_tag does not get called when there is no front page image.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_HAS_NO_image() {

		$stub =
			$this
				->getMockBuilder( 'WPSEO_OpenGraph' )
				->setMethods( array( 'og_tag' ) )
				->getMock();

		$stub
			->expects( $this->never() )
			->method( 'og_tag' );

		$stub->image();
	}

	/**
	 * Test if the opengraph-image (Facebook Image) is added to opengraph.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_and_HAS_open_graph_image() {
		$post_id = $this->factory->post->create();
		$image   = get_site_url() . '/wp-content/plugins/wordpress-seo/tests/assets/small.png';

		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'opengraph-image', $image, $post_id );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

		$expected_output = '<meta property="og:image" content="' . $image . '" />';

		$this->assertContains( $expected_output, $output );
	}

	/**
	 * Test if the content image does not get added to opengraph when there is an opengraph-image (Facebook Image).
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_image_IS_SINGULAR_and_HAS_open_graph_image_AND_HAS_content_images() {
		$post_id = $this->factory->post->create(
			array(
				'post_content' => '<img class="alignnone size-medium wp-image-490" src="' . get_site_url() . '/wp-content/plugins/wordpress-seo/tests/yoast.png" />',
			)
		);

		$image = get_site_url() . '/wp-content/plugins/wordpress-seo/tests/assets/small.png';

		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'opengraph-image', $image, $post_id );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

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

		$output = ob_get_clean();

		list( $src )     = wp_get_attachment_image_src( $attach_id, 'full' );
		$expected_output = '<meta property="og:image" content="' . $src . '" />';

		wp_delete_attachment( $attach_id, true );

		$this->assertNotContains( $expected_output, $output );
	}

	/**
	 * Test if featured image gets added to opengraph when it is the correct size.
	 *
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

		$output = ob_get_clean();

		list( $src )     = wp_get_attachment_image_src( $attach_id, 'full' );
		$expected_output = '<meta property="og:image" content="' . $src . '" />';

		wp_delete_attachment( $attach_id, true );

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
	 * Tests static page set as front page.
	 */
	public function test_static_front_page() {

		$post_id = $this->factory->post->create(
			array(
				'post_title' => 'front-page',
				'post_type'  => 'page',
			)
		);
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $post_id );
		$this->go_to_home();

		WPSEO_Meta::set_value( 'title', 'SEO title', $post_id );
		$title = self::$class_instance->og_title( false );
		$this->assertEquals( 'SEO title', $title );

		WPSEO_Meta::set_value( 'opengraph-title', 'OG title', $post_id );
		$title = self::$class_instance->og_title( false );
		$this->assertEquals( 'OG title', $title );

		WPSEO_Meta::set_value( 'metadesc', 'SEO description', $post_id );
		$description = self::$class_instance->description( false );
		$this->assertEquals( 'SEO description', $description );

		WPSEO_Meta::set_value( 'opengraph-description', 'OG description', $post_id );
		$description = self::$class_instance->description( false );
		$this->assertEquals( 'OG description', $description );
	}

	/**
	 * Tests static page set as posts page.
	 */
	public function test_static_posts_page() {

		$post_id = $this->factory->post->create(
			array(
				'post_title' => 'front-page',
				'post_type'  => 'page',
			)
		);
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $post_id );

		$post_id = $this->factory->post->create(
			array(
				'post_title' => 'blog-page',
				'post_type'  => 'page',
			)
		);
		update_option( 'page_for_posts', $post_id );
		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'title', 'SEO title', $post_id );
		$title = self::$class_instance->og_title( false );
		$this->assertEquals( 'SEO title', $title );

		WPSEO_Meta::set_value( 'opengraph-title', 'OG title', $post_id );
		$title = self::$class_instance->og_title( false );
		$this->assertEquals( 'OG title', $title );

		WPSEO_Meta::set_value( 'metadesc', 'SEO description', $post_id );
		$description = self::$class_instance->description( false );
		$this->assertEquals( 'SEO description', $description );

		WPSEO_Meta::set_value( 'opengraph-description', 'OG description', $post_id );
		$description = self::$class_instance->description( false );
		$this->assertEquals( 'OG description', $description );

		$image_url       = 'https://example.com/image.png';
		$expected_output = <<<EXPECTED
<meta property="og:image" content="{$image_url}" />
<meta property="og:image:secure_url" content="{$image_url}" />
EXPECTED;
		WPSEO_Meta::set_value( 'opengraph-image', $image_url, $post_id );

		ob_start();
		self::$class_instance->image( false );
		$result = trim( ob_get_clean() );

		$this->assertEquals( $expected_output, $result );
	}

	/**
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_description_single_post_opengraph_description() {
		$expected_opengraph_description = 'This is with a opengraph-description';

		// Creates the post.
		$post_id = $this->factory->post->create();

		$this->go_to( get_permalink( $post_id ) );

		// Checking opengraph-description and after obtaining its value, reset the meta value for it.
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

		// Creates the post.
		$post_id = $this->factory->post->create();

		WPSEO_Meta::set_value( 'metadesc', $expected_meta_description, $post_id );

		$this->go_to( get_permalink( $post_id ) );

		// Checking meta-description and after obtaining its value, reset the meta value for it.
		$meta_description = self::$class_instance->description( false );
		$this->assertEquals( $expected_meta_description, $meta_description );
	}

	/**
	 * Test description from excerpt.
	 */
	public function test_description_single_post_excerpt() {
		// Creates the post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Checking with the excerpt.
		$expected = get_the_excerpt();
		$excerpt  = self::$class_instance->description( false );

		$this->assertEquals( $expected, $excerpt );
	}

	/**
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_description_category() {

		$expected_meta_description = '';

		$category_id = wp_create_category( 'Yoast SEO' );
		$this->go_to( get_category_link( $category_id ) );

		// Checking meta-description and after obtaining its value, reset the meta value for it.
		$meta_description = self::$class_instance->description( false );
		$this->assertEquals( $expected_meta_description, $meta_description );
	}

	/**
	 * @covers WPSEO_OpenGraph::site_name
	 */
	public function test_site_name() {
		// @todo Empty site name test.
	}

	/**
	 * @covers WPSEO_OpenGraph::tags
	 */
	public function test_tags() {

		// Not singular, return false.
		$this->assertFalse( self::$class_instance->tags() );

		// Create post, without tags.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// No tags, should return false.
		$this->assertFalse( self::$class_instance->tags() );

		// Add tags to post.
		wp_set_post_tags( $post_id, 'Tag1, Tag2' );
		$expected_tags  = '<meta property="article:tag" content="Tag1" />' . "\n";
		$expected_tags .= '<meta property="article:tag" content="Tag2" />' . "\n";

		// Test again, this time with tags.
		$this->assertTrue( self::$class_instance->tags() );
		$this->expectOutput( $expected_tags );
	}

	/**
	 * @covers WPSEO_OpenGraph::category
	 */
	public function test_category() {

		// Not singular, should return false.
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

		// Not on singular, should return false.
		$this->assertFalse( self::$class_instance->publish_date() );

		// Create post, without tags.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test published_time tags output.
		$published_time   = get_the_date( DATE_W3C );
		$published_output = '<meta property="article:published_time" content="' . $published_time . '" />' . "\n";
		$this->assertTrue( self::$class_instance->publish_date() );
		$this->expectOutput( $published_output );

		// Modify post time.
		global $post;
		$post                    = get_post( $post_id );
		$post->post_modified     = gmdate( 'Y-m-d H:i:s', ( time() + 1 ) );
		$post->post_modified_gmt = gmdate( 'Y-m-d H:i:s', ( time() + 1 + ( get_option( 'gmt_offset' ) * HOUR_IN_SECONDS ) ) );

		// Test modified tags output.
		$modified_time   = get_the_modified_date( DATE_W3C );
		$modified_output = '<meta property="article:modified_time" content="' . $modified_time . '" />' . "\n" . '<meta property="og:updated_time" content="' . $modified_time . '" />' . "\n";
		$this->assertTrue( self::$class_instance->publish_date() );
		$this->expectOutput( $published_output . $modified_output );
	}

	/**
	 * Testing with an Open Graph title for the taxonomy.
	 *
	 * @covers WPSEO_OpenGraph::opengraph
	 */
	public function test_taxonomy_title() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'wpseo_opengraph-title', 'Custom taxonomy open graph title' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="og:title" content="Custom taxonomy open graph title" />', $output );
	}

	/**
	 * Testing with an Open Graph meta description for the taxonomy.
	 *
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_taxonomy_description() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'opengraph-description', 'Custom taxonomy open graph description' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="og:description" content="Custom taxonomy open graph description" />', $output );
	}

	/**
	 * Testing with an Open Graph meta description for the taxonomy.
	 *
	 * @covers WPSEO_OpenGraph::description
	 */
	public function test_taxonomy_description_with_replacevars() {
		$expected_title = 'Test title';
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category', 'name' => $expected_title ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'opengraph-description', '%%term_title%%' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

		$expected_html  = '<meta property="og:description" content="' . $expected_title . '" />' . "\n";

		$this->assertContains( $expected_html, $output );
	}

	/**
	 * Testing with an Open Graph meta image for the taxonomy.
	 *
	 * @covers WPSEO_OpenGraph::image
	 */
	public function test_taxonomy_image() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'wpseo_opengraph-image', home_url( 'custom_twitter_image.png' ) );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->opengraph();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="og:image" content="' . home_url( 'custom_twitter_image.png' ) . '" />', $output );
	}

	/**
	 * Tests the rendering of article:section for a post with two categories.
	 *
	 * @covers WPSEO_OpenGraph::category()
	 */
	public function test_get_category() {
		$post_id = $this->create_post_with_categories();

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->category();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="article:section" content="category1" />', $output );
	}

	/**
	 * Tests the rendering of article:section for a post with two categories wherefor the first
	 * set category will be removed via a filter.
	 *
	 * @covers WPSEO_OpenGraph::category()
	 */
	public function test_get_category_with_first_value_removed_by_filter() {
		add_filter( 'get_the_categories', array( $this, 'remove_first_category' ) );

		$post_id = $this->create_post_with_categories();

		$this->go_to( get_permalink( $post_id ) );

		$class_instance = new WPSEO_OpenGraph();

		ob_start();

		$class_instance->category();

		$output = ob_get_clean();

		$this->assertContains( '<meta property="article:section" content="category2" />', $output );

		remove_filter( 'get_the_categories', array( $this, 'remove_first_category' ) );
	}

	/**
	 * Creates a post with a pair of categories attached.
	 *
	 * @return int The created post id.
	 */
	protected function create_post_with_categories() {
		$post_id = self::factory()->post->create();
		$term1   = self::factory()
			->term
			->create(
				array(
					'name'     => 'category1',
					'taxonomy' => 'category',
				)
			);
		$term2   = self::factory()
			->term
			->create(
				array(
					'name'     => 'category2',
					'taxonomy' => 'category',
				)
			);

		self::factory()->term->add_post_terms( $post_id, array( $term1, $term2 ), 'category' );

		return $post_id;
	}

	/**
	 * Removes the first category from a list.
	 *
	 * @param array $categories List of categories.
	 *
	 * @return array The altered category.
	 */
	public function remove_first_category( $categories ) {
		unset( $categories[0] );

		return $categories;
	}

	/**
	 * @param string  $image   Path.
	 * @param integer $post_id Post ID.
	 *
	 * @return int
	 */
	private function create_featured_image( $image, $post_id ) {

		$basename       = basename( $image );
		$upload_dir     = wp_upload_dir();
		$source_image   = dirname( __FILE__ ) . '/..' . $image;
		$featured_image = $upload_dir['path'] . '/' . $basename;

		copy( $source_image, $featured_image ); // Prevent original from deletion.

		$file_array = array(
			'name'     => $basename,
			'tmp_name' => $featured_image,
		);
		$attach_id  = media_handle_sideload( $file_array, $post_id );

		return $attach_id;
	}
}
