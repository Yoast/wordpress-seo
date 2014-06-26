<?php

class WPSEO_Twitter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Twitter
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {

		ob_start();

		// create instance of WPSEO_Twitter class
		self::$class_instance = new WPSEO_Twitter;

		// clean output which was outputted by WPSEO_Twitter constructor
		ob_end_clean();
	}

	/**
	 * @covers WPSEO_Twitter::twitter
	 */
	public function test_twitter() {
		// TODO
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

		$name     = 'yoast';
		$expected = $this->metatag( 'creator', '@' . $name );

		// test option
		self::$class_instance->options['twitter_site'] = $name;
		self::$class_instance->author_twitter();
		$this->expectOutput( $expected );

		// reset option to make sure next result is from author meta
		self::$class_instance->options['twitter_site'] = '';

		/*
		 TODO fix this part

		// create post, attach user as author
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$post_id = $this->factory->post->create(
			array(
				'post_title' => 'Sample Post',
				'post_type' => 'post',
				'post_status' => 'publish',
			)
		);

		// go to post we just created
		$this->go_to( get_permalink( $post_id ) );

		// test user meta
		update_user_meta( $this->user_id, 'twitter', '@' . $name );
		self::$class_instance->author_twitter();
		$this->expectOutput( $expected );
		*/
	}

	/**
	 * @covers WPSEO_Twitter::twitter_title
	 */
	public function test_twitter_title() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'title', self::$class_instance->title( '' ) );
		self::$class_instance->twitter_title();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter_description
	 */
	public function test_twitter_description() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test excerpt
		$expected = $this->metatag( 'description', get_the_excerpt() );
		self::$class_instance->twitter_description();
		$this->expectOutput( $expected );


		// test wpseo meta
		WPSEO_Meta::set_value( 'metadesc', 'Meta description', $post_id );
		$expected = $this->metatag( 'description', self::$class_instance->metadesc( false ) );
		self::$class_instance->twitter_description();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter_url
	 */
	public function test_twitter_url() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected = $this->metatag( 'url', esc_url( self::$class_instance->canonical( false ) ) );
		self::$class_instance->twitter_url();
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
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_image() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// test default image
		$image_url = 'http://url-default-image.jpg';

		self::$class_instance->options['og_default_image'] = $image_url;
		$expected = $this->get_expected_image_output( $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );

		// reset default_image option
		self::$class_instance->options['og_default_image'] = '';

		// TODO test og_frontpage_image

		// test wpseo meta value
		$image_url = 'http://url-singular-meta-image.jpg';
		WPSEO_Meta::set_value( 'twitter-image', $image_url, $post_id );
		$expected = $this->get_expected_image_output( $image_url );

		self::$class_instance->image();
		$this->expectOutput( $expected );

		// TODO test post thumbnail
		// TODO test post content image
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
	 * @param $name
	 * @param $value
	 *
	 * @return string
	 */
	private function metatag( $name, $value ) {
		return '<meta name="twitter:' . $name . '" content="' . $value . '"/>' . "\n";
	}

}