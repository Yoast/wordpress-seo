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
class WPSEO_Twitter_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_OpenGraph */
	private static $class_instance;

	/**
	 * Set up class instance.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_Twitter();
	}

	/**
	 * Provision tests.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Frontend::get_instance()->reset();
		remove_all_actions( 'wpseo_twitter' );

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
		self::$class_instance->twitter();
		$this->assertEquals( 1, did_action( 'wpseo_twitter' ) );
		ob_clean();
	}

	/**
	 * @covers WPSEO_OpenGraph::og_title
	 */
	public function test_twitter_title() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$expected_title = WPSEO_Frontend::get_instance()->title( '' );
		$expected_html  = '<meta name="twitter:title" content="' . $expected_title . '" />' . "\n";

		$this->assertTrue( self::$class_instance->twitter_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( self::$class_instance->twitter_title( false ), $expected_title );
	}

	/**
	 * @covers WPSEO_OpenGraph::og_title
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

		$expected_html  = '<meta property="twitter:title" content="' . $expected_title . '" />' . "\n";

		$this->assertTrue( self::$class_instance->twitter_title() );
		$this->expectOutput( $expected_html );

		$this->assertEquals( self::$class_instance->twitter_title( false ), $expected_title );
	}

}
