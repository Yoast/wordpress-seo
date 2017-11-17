<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the unindexed posts query.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Premium_Prominent_Words_Unindexed_Post_Query */
	protected $class_instance;

	/**
	 * Sets the instance of the class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query();
	}

	/**
	 * Tests the exceeds_limit without posts results in a non exceeded limit
	 */
	public function test_exceeds_limit_without_posts() {
		$this->assertFalse( $this->class_instance->exceeds_limit( 10 ) );
	}

	/**
	 * Tests the exceeds_limit with 10 posts results in a non exceeded limit
	 */
	public function test_exceeds_limit_with_10_posts() {
		$this->factory()->post->create_many( 10 );

		$this->assertFalse( $this->class_instance->exceeds_limit( 10 ) );
	}


	/**
	 * Tests the exceeds_limit with 10 posts and pages results in a non exceeded limit
	 */
	public function test_exceeds_limit_with_10_posts_and_pages() {
		$this->factory()->post->create_many( 4, array( 'post_type' => 'post' ) );
		$this->factory()->post->create_many( 4, array( 'post_type' => 'page' ) );

		$this->assertFalse( $this->class_instance->exceeds_limit( 10 ) );
	}

	/**
	 * Tests the exceeds_limit with 20 posts and pages results in an exceeded limit.
	 */
	public function test_exceeds_limit_with_20_posts_and_pages() {
		$this->factory()->post->create_many( 20 );

		$this->assertTrue( $this->class_instance->exceeds_limit( 10 ) );
	}

	/**
	 * Tests get_total without any posts present.
	 */
	public function test_get_total_without_any_posts() {
		$this->assertEquals( 0, $this->class_instance->get_total( 'post' ) );
	}

	/**
	 * Tests get_total with a couple of posts present.
	 */
	public function test_get_total_with_posts() {
		$posts = $this->factory()->post->create_many( 10 );

		foreach ( $posts as $post_id ) {
			delete_post_meta( $post_id, WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME );
		}

		$this->assertEquals( 10, $this->class_instance->get_total( 'post' ) );
	}

	/**
	 * Tests get_total with a couple of posts present.
	 */
	public function test_get_total_with_posts_and_pages() {
		$posts = $this->factory()->post->create_many( 10 );
		$this->factory()->post->create_many( 8, array( 'post_type' => 'page' ) );

		foreach ( $posts as $post_id ) {
			delete_post_meta( $post_id, WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME );
		}

		$this->assertEquals( 10, $this->class_instance->get_total( 'post' ) );
		$this->assertEquals( 8, $this->class_instance->get_total( 'page' ) );
	}
}
