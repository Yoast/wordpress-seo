<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Recalculate_Posts_Test extends WPSEO_UnitTestCase {

	/**
	 * @var array
	 */
	private $posts;

	/**
	 * @var WPSEO_Recalculate_Posts
	 */
	private $instance;

	/**
	 * Setup the class instance and create some posts
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Recalculate_Posts();

		$this->posts = array(
			1 => $this->factory->post->create( array( 'post_title' => 'Post with focus keyword' ) ),
			2 => $this->factory->post->create( array( 'post_title' => 'Test Post 2' ) ),
			3 => $this->factory->post->create( array( 'post_title' => 'Test Post 3' ) ),
			4 => $this->factory->post->create( array( 'post_title' => 'Test Post 4' ) ),
		);
	}

	/**
	 * Test the saving of the scores
	 *
	 * @covers WPSEO_Recalculate_Posts::save_scores
	 */
	public function test_save_scores_with_focus_kw() {

		$this->assertEquals( WPSEO_Meta::get_value( 'linkdex', $this->posts[1] ), 0 );

		$this->instance->save_scores(
			array(
				array(
					'item_id' => $this->posts[1],
					'score'   => 10,
				),
			)
		);
	}

	/**
	 * Test getting the response for calculating the score for the posts with no focus keyword being set.
	 *
	 * @covers WPSEO_Recalculate_Posts::get_items_to_recalculate
	 */
	public function test_get_items_to_recalculate_no_focus_keywords() {
		$response = $this->instance->get_items_to_recalculate(1);

		$this->assertEquals( array( 'items' => array(), 'total_items' => 0 ), $response );
	}

	/**
	 * Test getting the response for calculating the score for the posts
	 *
	 * @covers WPSEO_Recalculate_Posts::get_items_to_recalculate
	 */
	public function test_getting_posts_to_recalculate_with_focus_keyword_set_for_two_of_them() {
		// Set focus keywords for to of the posts.
		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $this->posts[1] );
		WPSEO_Meta::set_value( 'focuskw', 'testable', $this->posts[3] );

		$response = $this->instance->get_items_to_recalculate(1);

		$this->assertEquals( 2, $response['total_items'] );
		$this->assertTrue( is_array( $response['items'] ) );

	}

	/**
	 * Test adding content to the post
	 */
	public function test_add_content() {
		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $this->posts[1] );

		$post = get_post($this->posts[1]);
		$expected = $this->add_dummy_content( $post->post_content );

		add_filter( 'wpseo_post_content_for_recalculation', array( $this, 'add_dummy_content' ), 10, 2 );

		$response = $this->instance->get_items_to_recalculate(1);

		remove_filter( 'wpseo_post_content_for_recalculation', array( $this, 'add_dummy_content' ) );

		$this->assertEquals( $expected, $response['items'][0]['text'] );
	}

	/**
	 * Test adding content to the post with a shortcode
	 */
	public function test_add_content_with_shortcode() {
		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $this->posts[1] );

		$post = get_post($this->posts[1]);
		$expected = do_shortcode( $this->add_dummy_content_with_shortcode( $post->post_content ) );

		add_filter( 'wpseo_post_content_for_recalculation', array( $this, 'add_dummy_content_with_shortcode' ), 10, 2 );

		$response = $this->instance->get_items_to_recalculate(1);

		remove_filter( 'wpseo_post_content_for_recalculation', array( $this, 'add_dummy_content_with_shortcode' ) );

		$this->assertEquals( $expected, $response['items'][0]['text'] );
	}

	/**
	 * Provide filter dummy data
	 *
	 * @param string $content
	 * @param WP_Post|null $post
	 *
	 * @return string
	 */
	public function add_dummy_content( $content, WP_Post $post = null ) {
		return $content . ' _extra_dummy_content_';
	}

	/**
	 * Provide filer dummy data with shortcode
	 *
	 * @param $content
	 * @param WP_Post|null $post
	 *
	 * @return string
	 */
	public function add_dummy_content_with_shortcode( $content, WP_Post $post = null ) {
		return $content . ' [caption]My Caption[/caption]';
	}

}
