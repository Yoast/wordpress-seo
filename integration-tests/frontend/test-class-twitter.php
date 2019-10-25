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
	 * Holds the instance of the class being tested.
	 *
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
		// Clean output which was echo-ed out by WPSEO_Twitter constructor.
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
}
