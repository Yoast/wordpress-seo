<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Tests the WPSEO_Statistics class
 */
class WPSEO_Statistics_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Statistics
	 */
	protected $instance;

	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Statistics();
	}

	/**
	 * Tests if the default state of the database (no posts) returns zero for all statistics
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_empty_statistics() {
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::POOR ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_INDEX ) ) );
	}


	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_filled_statistics() {
		$posts = $this->factory->post->create_many( 100, array(
			'post_status' => 'publish'
		) );

		$i = 0;
		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_linkdex', $i++ );
		}

		$this->assertEquals( 34, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 20, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::POOR ) ) );
		$this->assertEquals( 20, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 25, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
	}

	/**
	 * Tests if the functions only count published posts
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_only_published_posts() {
		$posts = $this->factory->post->create_many( 100, array(
			'post_status' => 'draft'
		) );

		$i = 0;
		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_linkdex', $i++ );
		}

		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::POOR ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
	}

	/**
	 * Tests the no index statistics function
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_no_index_statistics() {
		$posts = $this->factory->post->create_many( 7, array(
			'post_status' => 'publish',
		) );

		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', '1' );
		}

		$this->assertEquals( 7, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_INDEX ) ) );
	}
}
