<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Tests the WPSEO_Statistics class
 */
class WPSEO_Statistics_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Statistics
	 */
	protected $instance;

	/**
	 * Default arguments to use to create a post for the tests in this class.
	 *
	 * @var array
	 */
	private $default_post_args = [
		'post_status' => 'publish',
	];

	/**
	 * Set up the class which will be tested.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Statistics();
	}

	/**
	 * Tests if the default state of the database (no posts) returns zero for all statistics.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_empty_statistics() {
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_INDEX ) ) );
	}

	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_filled_statistics_no_focus() {
		$posts = $this->factory->post->create_many( 2, $this->default_post_args );

		add_post_meta( $posts[1], '_yoast_wpseo_focuskw', 'focus keyword' );

		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
	}

	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_filled_statistics_bad() {
		$posts = $this->factory->post->create_many( 4, $this->default_post_args );

		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 0 ); // Not bad.
		add_post_meta( $posts[1], '_yoast_wpseo_linkdex', 1 ); // Bad.
		add_post_meta( $posts[2], '_yoast_wpseo_linkdex', 40 ); // Bad.
		add_post_meta( $posts[3], '_yoast_wpseo_linkdex', 41 ); // Not bad.

		$this->assertEquals( 2, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
	}

	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_filled_statistics_ok() {
		$posts = $this->factory->post->create_many( 4, $this->default_post_args );

		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 40 ); // Not OK.
		add_post_meta( $posts[1], '_yoast_wpseo_linkdex', 41 ); // OK.
		add_post_meta( $posts[2], '_yoast_wpseo_linkdex', 70 ); // OK.
		add_post_meta( $posts[3], '_yoast_wpseo_linkdex', 71 ); // Not OK.

		$this->assertEquals( 2, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
	}

	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_filled_statistics_good() {
		$posts = $this->factory->post->create_many( 4, $this->default_post_args );

		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 70 ); // Not good.
		add_post_meta( $posts[1], '_yoast_wpseo_linkdex', 71 ); // Good.
		add_post_meta( $posts[2], '_yoast_wpseo_linkdex', 100 ); // Good.
		add_post_meta( $posts[3], '_yoast_wpseo_linkdex', 101 ); // Not good.

		$this->assertEquals( 2, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
	}

	/**
	 * Tests if the functions only count published posts.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_all_statistics_published_posts() {
		$posts = $this->factory->post->create_many( 4, $this->default_post_args );

		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 0 ); // No-focus.
		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 1 ); // Bad.

		add_post_meta( $posts[1], '_yoast_wpseo_linkdex', 41 ); // OK.
		add_post_meta( $posts[1], '_yoast_wpseo_focuskw', 'focus keyword' );

		add_post_meta( $posts[2], '_yoast_wpseo_linkdex', 71 ); // Good.
		add_post_meta( $posts[2], '_yoast_wpseo_focuskw', 'focus keyword' );

		add_post_meta( $posts[3], '_yoast_wpseo_focuskw', 'focus keyword' );

		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 1, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
	}

	/**
	 * Tests if the functions only count published posts.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_only_published_posts() {
		$posts = $this->factory->post->create_many( 4, [ 'post_status' => 'draft' ] );

		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 0 ); // No-focus.
		add_post_meta( $posts[0], '_yoast_wpseo_linkdex', 1 ); // Bad.
		add_post_meta( $posts[1], '_yoast_wpseo_linkdex', 41 ); // OK.
		add_post_meta( $posts[2], '_yoast_wpseo_linkdex', 71 ); // Good.

		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::BAD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::OK ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::GOOD ) ) );
		$this->assertEquals( 0, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ) ) );
	}

	/**
	 * Tests the no index statistics function.
	 *
	 * @covers WPSEO_Statistics::get_post_count
	 */
	public function test_no_index_statistics() {
		$posts = $this->factory->post->create_many( 7, $this->default_post_args );

		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', '1' );
		}

		$this->assertEquals( 7, $this->instance->get_post_count( new WPSEO_Rank( WPSEO_Rank::NO_INDEX ) ) );
	}
}
