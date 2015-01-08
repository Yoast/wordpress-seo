<?php

class WPSEO_Twitter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Twitter
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		ob_start();

		// create instance of WPSEO_Twitter class
		require 'framework/class-expose-wpseo-twitter.php';
		self::$class_instance = new Expose_WPSEO_Twitter();

		// clean output which was outputted by WPSEO_Twitter constructor
		ob_end_clean();
	}

	public function tearDown() {
		// Reset shown images
		self::$class_instance->shown_images = array();
		ob_clean();
		WPSEO_Frontend::get_instance()->reset();
	}

	/**
	 * @covers WPSEO_Twitter::twitter
	 */
	public function test_twitter() {
		$post_id = $this->factory->post->create(
			array(
				'post_title'  => 'Test Post',
				'post_excerpt' => 'Test Excerpt',
				'post_type'   => 'post',
				'post_status' => 'publish',
			)
		);
		$this->go_to( get_permalink( $post_id ) );

		ob_clean();
		self::$class_instance->twitter();

		$expected = '<meta name="twitter:card" content="summary"/>
<meta name="twitter:description" content="Test Excerpt"/>
<meta name="twitter:title" content="Test Post - Test Blog"/>
<meta name="twitter:domain" content="Test Blog"/>
';
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::type
	 */
	public function test_type() {

		// test invalid option, should default to summary
		self::$class_instance->options['twitter_card_type'] = 'something_invalid';
		$expected                                           = $this->metatag( 'card', 'summary' );

		self::$class_instance->type();
		$this->expectOutput( $expected );

		// test valid option
		self::$class_instance->options['twitter_card_type'] = 'photo';
		$expected                                           = $this->metatag( 'card', 'photo' );

		self::$class_instance->type();
		$this->expectOutput( $expected );

		self::$class_instance->options['twitter_card_type'] = 'summary';
	}

	/**
	 * @param $name
	 * @param $value
	 *
	 * @return string
	 */
	private function metatag( $name, $value ) {
		return '<meta name="twitter:' . $name . '" content="' . $value . '"/>' . "\n";
	}

	/**
	 * @covers WPSEO_Twitter::site_twitter
	 */
	public function test_site_twitter() {
		// test valid option
		self::$class_instance->options['twitter_site'] = 'yoast';
		$expected                                      = $this->metatag( 'site', '@yoast' );

		self::$class_instance->site_twitter();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_site_domain() {
		// test valid option
		$expected = $this->metatag( 'domain', get_bloginfo( 'name' ) );

		self::$class_instance->site_domain();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_author_twitter() {
		// create user, create post, attach user as author
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id = $this->factory->post->create(
			array(
				'post_title'  => 'Sample Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			)
		);

		// go to post we just created
		$this->go_to( get_permalink( $post_id ) );

		// test fallback to twitter_site option
		self::$class_instance->options['twitter_site'] = 'yoast';
		self::$class_instance->author();
		$expected = $this->metatag( 'creator', '@yoast' );
		$this->expectOutput( $expected );

		// create user, give twitter ID, this should now overwrite the site's settings
		update_user_meta( $user_id, 'twitter', '@jdevalk' );
		$expected = $this->metatag( 'creator', '@jdevalk' );
		$this->go_to( get_permalink( $post_id ) );

		// test user meta
		self::$class_instance->author();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::title
	 */
	public function test_twitter_title() {
		// create and go to post
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
		// Instantiate class again as it generates the description only once
		$class = new Expose_WPSEO_Twitter();

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test excerpt
		$expected = $this->metatag( 'description', get_the_excerpt() );

		ob_clean();
		$class->description();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::description
	 */
	public function test_twitter_description_metadesc() {
		// Instantiate class again as it generates the description only once
		$class = new Expose_WPSEO_Twitter();
		// create and go to post
		$post_id = $this->factory->post->create();

		// test wpseo meta
		WPSEO_Meta::set_value( 'metadesc', 'Meta description', $post_id );

		$this->go_to( get_permalink( $post_id ) );
		$expected = $this->metatag( 'description', WPSEO_Frontend::get_instance()->metadesc( false ) );

		ob_clean();
		$class->description();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::url
	 */
	public function test_twitter_url() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'url', esc_url( WPSEO_Frontend::get_instance()->canonical( false ) ) );
		self::$class_instance->url();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::image_output
	 */
	public function test_image_output() {
		$image_url = 'http://url.jpg';

		// test image url
		$expected = $this->metatag( 'image:src', $image_url );
		$result   = self::$class_instance->image_output( $image_url );
		$this->assertTrue( $result );
		$this->expectOutput( $expected );

		// same image url shouldn't be shown twice
		$result = self::$class_instance->image_output( $image_url );
		$this->assertFalse( $result );
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_homepage_image() {
		// test default image
		$image_url = 'http://url-default-image.jpg';

		// reset default_image option
		self::$class_instance->options['og_frontpage_image'] = $image_url;

		$this->go_to_home();
		$expected = $this->metatag( 'image:src', $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_default_image() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test default image
		$image_url = 'http://url-default-image.jpg';

		self::$class_instance->options['og_default_image'] = $image_url;
		$expected                                          = $this->get_expected_image_output( $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @param $url
	 *
	 * @return string
	 */
	private function get_expected_image_output( $url ) {

		// get expected output
		self::$class_instance->image_output( $url );
		$expected = ob_get_contents();
		ob_clean();

		// reset shown_images array
		self::$class_instance->shown_images = array();

		return $expected;
	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_meta_value_image() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test wpseo meta value
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
		$post_id = $this->factory->post->create();
		$filename = 'post-thumbnail.jpg';
		$attachment_id = $this->factory->attachment->create_object( $filename, 0, array(
			'post_mime_type' => 'image/jpeg',
			'post_type'      => 'attachment'
		) );
		update_post_meta( $post_id, '_thumbnail_id', $attachment_id );
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'image:src', 'http://' . WP_TESTS_DOMAIN . "/wp-content/uploads/$filename" );

		self::$class_instance->image();
		$this->expectOutput( $expected );

	}

	/**
	 * @covers WPSEO_Twitter::image()
	 */
	public function test_post_content_image() {
		$url = 'http://example.com/example.jpg';
		$post_id = $this->factory->post->create( array( 'post_content' => "Bla <img src='$url'/> bla" ) );
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'image:src', $url );

		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::gallery_images_output()
	 */
	public function test_gallery_images() {
		$ids      = array();
		$expected = $this->metatag( 'card', 'gallery' );

		// Insert images into DB so we have something to test against
		foreach ( range( 0, 2 ) as $i ) {
			$filename = "image$i.jpg";
			$ids[] = $this->factory->attachment->create_object( $filename, 0, array(
				'post_mime_type' => 'image/jpeg',
				'post_type'      => 'attachment'
			) );
			$expected .= $this->metatag( 'image' . $i, 'http://' . WP_TESTS_DOMAIN . "/wp-content/uploads/$filename" );
		}

		// Create and go to post
		$content = '[gallery ids="' . join( ',', $ids ) . '"]';
		$post_id = $this->factory->post->create( array( 'post_content' => $content ) );
		$this->go_to( get_permalink( $post_id ) );

		self::$class_instance->type();
		self::$class_instance->image();
		$this->expectOutput( $expected );
	}

}