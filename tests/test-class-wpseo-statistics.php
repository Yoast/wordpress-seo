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
	 * @covers WPSEO_Statistics::get_bad_seo_post_count
	 * @covers WPSEO_Statistics::get_poor_seo_post_count
	 * @covers WPSEO_Statistics::get_ok_seo_post_count
	 * @covers WPSEO_Statistics::get_good_seo_post_count
	 * @covers WPSEO_Statistics::get_no_focus_post_count
	 * @covers WPSEO_Statistics::get_no_index_seo_post_count
	 */
	public function test_empty_statistics() {
		$this->assertEquals( 0, $this->instance->get_bad_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_poor_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_ok_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_good_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_no_focus_post_count() );
		$this->assertEquals( 0, $this->instance->get_no_index_post_count() );
	}


	/**
	 * Tests if the statistics functions can correctly count the amount of posts in the database
	 *
	 * @covers WPSEO_Statistics::get_bad_seo_post_count
	 * @covers WPSEO_Statistics::get_poor_seo_post_count
	 * @covers WPSEO_Statistics::get_ok_seo_post_count
	 * @covers WPSEO_Statistics::get_good_seo_post_count
	 * @covers WPSEO_Statistics::get_no_focus_post_count
	 */
	public function test_filled_statistics() {
		$posts = $this->factory->post->create_many( 100, array(
			'post_status' => 'publish'
		) );

		$i = 0;
		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_linkdex', $i++ );
		}

		$this->assertEquals( 34, $this->instance->get_bad_seo_post_count() );
		$this->assertEquals( 20, $this->instance->get_poor_seo_post_count() );
		$this->assertEquals( 20, $this->instance->get_ok_seo_post_count() );
		$this->assertEquals( 25, $this->instance->get_good_seo_post_count() );
		$this->assertEquals( 1, $this->instance->get_no_focus_post_count() );
	}

	/**
	 * Tests if the functions only count published posts
	 *
	 * @covers WPSEO_Statistics::get_bad_seo_post_count
	 * @covers WPSEO_Statistics::get_poor_seo_post_count
	 * @covers WPSEO_Statistics::get_ok_seo_post_count
	 * @covers WPSEO_Statistics::get_good_seo_post_count
	 * @covers WPSEO_Statistics::get_no_focus_post_count
	 */
	public function test_only_published_posts() {
		$posts = $this->factory->post->create_many( 100, array(
			'post_status' => 'draft'
		) );

		$i = 0;
		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_linkdex', $i++ );
		}

		$this->assertEquals( 0, $this->instance->get_bad_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_poor_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_ok_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_good_seo_post_count() );
		$this->assertEquals( 0, $this->instance->get_no_focus_post_count() );
	}

	/**
	 * Tests the no index statistics function
	 *
	 * @covers WPSEO_Statistics::get_no_index_seo_post_count
	 */
	public function test_no_index_statistics() {
		$posts = $this->factory->post->create_many( 7, array(
			'post_status' => 'publish',
		) );

		foreach ( $posts as $post_id ) {
			add_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', '1' );
		}

		$this->assertEquals( 7, $this->instance->get_no_index_post_count() );
	}
}