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

		$this->assertEquals(  "", $response );
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

}
