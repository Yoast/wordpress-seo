<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Twitter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var Expose_WPSEO_Twitter
	 */
	private static $class_instance;

	/**
	 * Set up a WPSEO_Twitter object.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		ob_start();

		// Create instance of WPSEO_Twitter class.
		self::$class_instance = new Expose_WPSEO_Twitter();
		WPSEO_Frontend::get_instance()->reset();
		// Clean output which was outputted by WPSEO_Twitter constructor.
		ob_end_clean();
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown() {
		parent::tearDown();
		ob_clean();
		WPSEO_Frontend::get_instance()->reset();

		// Reset shown images.
		self::$class_instance->shown_images = array();
	}

	/**
	 * @covers WPSEO_Twitter::twitter
	 */
	public function test_twitter() {
		$post_id = $this->factory->post->create(
			array(
				'post_title'   => 'Twitter Test Post',
				'post_excerpt' => 'Twitter Test Excerpt',
				'post_type'    => 'post',
				'post_status'  => 'publish',
			)
		);
		$this->go_to( get_permalink( $post_id ) );

		self::$class_instance->twitter();

		$expected = '<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:description" content="Twitter Test Excerpt" />
<meta name="twitter:title" content="Twitter Test Post - Test Blog" />
';
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::type
	 */
	public function test_type() {

		// Test invalid option, should default to summary.
		WPSEO_Options::set( 'twitter_card_type', 'something_invalid' );
		$expected = $this->metatag( 'card', 'summary_large_image' );

		self::$class_instance->type();
		$this->expectOutput( $expected );

		// Test valid option.
		WPSEO_Options::set( 'twitter_card_type', 'summary' );
		$expected = $this->metatag( 'card', 'summary' );

		self::$class_instance->type();
		$this->expectOutput( $expected );

		WPSEO_Options::set( 'twitter_card_type', 'summary' );
	}

	/**
	 * @param string $name  Name.
	 * @param string $value Value.
	 *
	 * @return string
	 */
	private function metatag( $name, $value ) {
		return '<meta name="twitter:' . $name . '" content="' . $value . '" />' . "\n";
	}

	/**
	 * @covers WPSEO_Twitter::site_twitter
	 */
	public function test_site_twitter() {
		// Test valid option.
		WPSEO_Options::set( 'twitter_site', 'yoast' );
		$expected = $this->metatag( 'site', '@yoast' );

		self::$class_instance->site_twitter();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::author
	 */
	public function test_author_twitter() {
		// Create user, create post, attach user as author.
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id = $this->factory->post->create(
			array(
				'post_title'  => 'Sample Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			)
		);

		// Go to post we just created.
		$this->go_to( get_permalink( $post_id ) );

		// Test fallback to twitter_site option.
		WPSEO_Options::set( 'twitter_site', 'yoast' );
		self::$class_instance->author();
		$expected = $this->metatag( 'creator', '@yoast' );
		$this->expectOutput( $expected );

		// Create user, give twitter ID, this should now overwrite the site's settings.
		update_user_meta( $user_id, 'twitter', '@jdevalk' );
		$expected = $this->metatag( 'creator', '@jdevalk' );
		$this->go_to( get_permalink( $post_id ) );

		// Test user meta.
		self::$class_instance->author();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::title
	 */
	public function test_twitter_title() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'title', WPSEO_Frontend::get_instance()->title( '' ) );
		self::$class_instance->title();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::description
	 */
	public function test_twitter_description_excerpt() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test excerpt.
		$expected = $this->metatag( 'description', get_the_excerpt() );

		ob_clean();
		self::$class_instance->description();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::description
	 */
	public function test_twitter_description_metadesc() {
		// Create and go to post.
		$post_id = $this->factory->post->create();

		// Test wpseo meta.
		WPSEO_Meta::set_value( 'metadesc', 'Meta description', $post_id );

		$this->go_to( get_permalink( $post_id ) );
		$expected = $this->metatag( 'description', WPSEO_Frontend::get_instance()->metadesc( false ) );

		self::$class_instance->description();
		$this->expectOutput( $expected );
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
		self::$class_instance->title();
		$this->expectOutput( $this->metatag( 'title', 'SEO title' ) );

		WPSEO_Meta::set_value( 'twitter-title', 'Twitter title', $post_id );
		self::$class_instance->title();
		$this->expectOutput( $this->metatag( 'title', 'Twitter title' ) );

		WPSEO_Meta::set_value( 'metadesc', 'SEO description', $post_id );
		self::$class_instance->description();
		$this->expectOutput( $this->metatag( 'description', 'SEO description' ) );

		WPSEO_Meta::set_value( 'twitter-description', 'Twitter description', $post_id );
		self::$class_instance->description();
		$this->expectOutput( $this->metatag( 'description', 'Twitter description' ) );
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
		self::$class_instance->title();
		$this->expectOutput( $this->metatag( 'title', 'SEO title' ) );

		WPSEO_Meta::set_value( 'twitter-title', 'Twitter title', $post_id );
		self::$class_instance->title();
		$this->expectOutput( $this->metatag( 'title', 'Twitter title' ) );

		WPSEO_Meta::set_value( 'metadesc', 'SEO description', $post_id );
		self::$class_instance->description();
		$this->expectOutput( $this->metatag( 'description', 'SEO description' ) );

		WPSEO_Meta::set_value( 'twitter-description', 'Twitter description', $post_id );
		self::$class_instance->description();
		$this->expectOutput( $this->metatag( 'description', 'Twitter description' ) );

		$image_url = 'https://example.com/image.png';
		WPSEO_Meta::set_value( 'twitter-image', $image_url, $post_id );
		self::$class_instance->image();
		$this->expectOutput( $this->metatag( 'image', $image_url ) );
	}

	/**
	 * @covers WPSEO_Twitter::image_output
	 */
	public function test_image_output() {
		$image_url = 'http://url.jpg';

		// Test image URL.
		$expected = $this->metatag( 'image', $image_url );
		$result   = self::$class_instance->image_output( $image_url );
		$this->assertTrue( $result );
		$this->expectOutput( $expected );

		// Same image URL shouldn't be shown twice.
		$result = self::$class_instance->image_output( $image_url );
		$this->assertFalse( $result );
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_homepage_image() {
		// Test default image.
		$image_url = 'http://url-default-image.jpg';

		// Reset default_image option.
		WPSEO_Options::set( 'og_frontpage_image', $image_url );

		$this->go_to_home();
		$expected = $this->metatag( 'image', $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_default_image() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test default image.
		$image_url = 'http://url-default-image.jpg';

		WPSEO_Options::set( 'og_default_image', $image_url );
		$expected = $this->get_expected_image_output( $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @param string $url URL.
	 *
	 * @return string
	 */
	private function get_expected_image_output( $url ) {

		// Get expected output.
		self::$class_instance->image_output( $url );
		$expected = ob_get_contents();
		ob_clean();

		// Reset shown_images array.
		self::$class_instance->shown_images = array();

		return $expected;
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_meta_value_image() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Test wpseo meta value.
		$image_url = 'http://url-singular-meta-image.jpg';
		WPSEO_Meta::set_value( 'twitter-image', $image_url, $post_id );
		$expected = $this->get_expected_image_output( $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_post_thumbnail_image() {
		$post_id       = $this->factory->post->create();
		$filename      = 'post-thumbnail.jpg';
		$attachment_id = $this->factory->attachment->create_object( $filename, 0, array(
			'post_mime_type' => 'image/jpeg',
			'post_type'      => 'attachment',
		) );
		update_post_meta( $post_id, '_thumbnail_id', $attachment_id );
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'image', 'http://' . WP_TESTS_DOMAIN . "/wp-content/uploads/$filename" );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}
	
	/**
	 * Testing with a twitter title set for the taxonomy.
	 *
	 * @covers WPSEO_Twitter::title
	 */
	public function test_taxonomy_title() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'wpseo_twitter-title', 'Custom taxonomy twitter title' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->title();

		$this->expectOutput( $this->metatag( 'title', 'Custom taxonomy twitter title' ) );
	}

	/**
	 * Testing with a twitter meta description set for the taxonomy.
	 *
	 * @covers WPSEO_Twitter::description
	 */
	public function test_taxonomy_description() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'wpseo_twitter-description', 'Custom taxonomy twitter description' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->description();

		$this->expectOutput( $this->metatag( 'description', 'Custom taxonomy twitter description' ) );
	}

	/**
	 * Testing with a twitter meta image set for the taxonomy.
	 *
	 * @covers WPSEO_Twitter::image
	 */
	public function test_taxonomy_image() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'wpseo_twitter-image', home_url( 'custom_twitter_image.png' ) );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->image();

		$this->expectOutput( $this->metatag( 'image', home_url( 'custom_twitter_image.png' ) ) );
	}

	/**
	 * @covers WPSEO_Twitter::gallery_images_output()
	 */
	public function test_gallery_images() {

		$expected = $this->metatag( 'card', 'summary_large_image' );

		// Insert image into DB so we have something to test against.
		$filename  = 'image.jpg';
		$id        = $this->factory->attachment->create_object( $filename, 0, array(
			'post_mime_type' => 'image/jpeg',
			'post_type'      => 'attachment',
		) );
		$expected .= $this->metatag( 'image', 'http://' . WP_TESTS_DOMAIN . "/wp-content/uploads/$filename" );

		// Create and go to post.
		$content = '[gallery ids="' . $id . '"]';
		$post_id = $this->factory->post->create( array( 'post_content' => $content ) );
		$this->go_to( get_permalink( $post_id ) );

		self::$class_instance->type();
		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter
	 */
	public function test_twitter_action_execution() {
		self::$class_instance->twitter();
		$this->assertEquals( 1, did_action( 'wpseo_twitter' ) );
		ob_clean();
	}

	/**
	 * @covers WPSEO_Twitter::title
	 */
	public function test_twitter_title_with_variables() {
		$expected_title = 'Test title';
		// Create and go to post.
		$post_id = $this->factory->post->create();
		wp_update_post( array(
			'ID'         => $post_id,
			'post_title' => $expected_title,
		) );
		WPSEO_Meta::set_value( 'twitter-title', '%%title%%', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'title', $expected_title );

		self::$class_instance->title();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::description
	 */
	public function test_twitter_description_with_variables() {
		$expected_title = 'Post title';

		// Create and go to post.
		$post_id = $this->factory->post->create();
		wp_update_post( array(
				'ID'         => $post_id,
				'post_title' => $expected_title,
			)
		);

		// Test wpseo meta.
		WPSEO_Meta::set_value( 'twitter-description', '%%title%%', $post_id );

		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'description', $expected_title );

		self::$class_instance->description();
		$this->expectOutput( $expected );
	}
}
