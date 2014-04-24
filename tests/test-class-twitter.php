<?php

class WPSEO_Twitter_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Twitter
	 */
	private $class_instance;

	/**
	 * @var int
	 */
	private $post_id;

	/**
	 * @var int
	 */
	private $user_id;

	/**
	 * Provision tests
	 */
	public function setUp() {

		parent::setUp();

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

		// go to single post
		$this->go_to( get_permalink( $this->post_id ) );

		// create instance of WPSEO_Twitter class
		$this->class_instance = new WPSEO_Twitter();

		// clean output thrown by the WPSEO_Twitter::__construct method
		ob_clean();
	}

	/**
	 * Clean-up
	 */
	public function tearDown() {
		parent::tearDown();

		// delete post
		wp_delete_post( $this->post_id );

		// go back to home page
		$this->go_to_home();
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

	/**
	 * @covers WPSEO_Twitter::output_metatag
	 */
	/*
	public function test_output_metatag() {
		$name = 'card';
		$value = 'summary';
		$expected = $this->metatag( $name, $value );

		$this->class_instance->output_metatag( $name, $value );
		$this->expectOutput( $expected );
	}
	*/

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
		$this->class_instance->options['twitter_card_type'] = 'something_invalid';
		$expected = $this->metatag( 'card', 'summary' );

		$this->class_instance->type();
		$this->expectOutput( $expected );

		// test valid option
		$this->class_instance->options['twitter_card_type'] = 'photo';
		$expected = $this->metatag( 'card', 'photo' );

		$this->class_instance->type();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::site_twitter
	 */
	public function test_site_twitter() {
		// test valid option
		$this->class_instance->options['twitter_site'] = 'yoast';
		$expected = $this->metatag( 'site', '@yoast' );

		$this->class_instance->site_twitter();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_site_domain() {
		// test valid option
		$expected = $this->metatag( 'domain', get_bloginfo('name') );

		$this->class_instance->site_domain();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_author_twitter() {
		$name = 'yoast';
		$expected = $this->metatag( 'creator', '@' . $name );

		// test option
		$this->class_instance->options['twitter_site'] = $name;
		$this->class_instance->author_twitter();
		$this->expectOutput( $expected );

		// reset option to make sure next result is from author meta
		$this->class_instance->options['twitter_site'] = '';

		// test user meta
		add_user_meta( $this->user_id, 'twitter', $name );
		$this->class_instance->author_twitter();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter_title
	 */
	public function test_twitter_title() {
		$expected = $this->metatag( 'title', $this->class_instance->title( '' ) );
		$this->class_instance->twitter_title();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter_description
	 */
	public function test_twitter_description() {

		// test excerpt
		$expected = $this->metatag( 'description', get_the_excerpt() );
		$this->class_instance->twitter_description();
		$this->expectOutput( $expected );


		// test wpseo meta
		WPSEO_Meta::set_value( 'metadesc', 'Meta description', $this->post_id );
		$expected = $this->metatag( 'description', $this->class_instance->metadesc( false ) );
		$this->class_instance->twitter_description();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::twitter_url
	 */
	public function test_twitter_url() {
		$expected = $this->metatag( 'url', esc_url( $this->class_instance->canonical( false ) ) );
		$this->class_instance->twitter_url();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_Twitter::image_output
	 */
	public function test_image_output() {
		$image_url = 'http://url.jpg';

		// test image url
		$expected = $this->metatag( 'image:src', $image_url );
		$result = $this->class_instance->image_output( $image_url );
		$this->assertTrue( $result );
		$this->expectOutput( $expected );

		// same image url shouldn't be shown twice
		$result = $this->class_instance->image_output( $image_url );
		$this->assertFalse( $result );
	}

	/**
	 * @covers WPSEO_Twitter::site_domain
	 */
	public function test_image() {
		// test default image
		$image_url = 'http://url-default-image.jpg';

		$this->class_instance->options['og_default_image'] = $image_url;
		$expected = $this->get_expected_image_output( $image_url );

		$this->class_instance->image();
		$this->expectOutput( $expected );

		// reset default_image option
		$this->class_instance->options['og_default_image'] = '';

		// TODO test og_frontpage_image

		// test wpseo meta value
		$image_url = 'http://url-singular-meta-image.jpg';
		WPSEO_Meta::set_value( 'twitter-image', $image_url, $this->post_id );
		$expected = $this->get_expected_image_output( $image_url );

		$this->class_instance->image();
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
		$this->class_instance->image_output( $url );
		$expected = ob_get_contents();
		ob_clean();

		// reset shown_images array
		$this->class_instance->shown_images = array();

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