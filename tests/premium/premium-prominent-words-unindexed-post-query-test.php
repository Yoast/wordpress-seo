<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the unindexed posts query.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Premium_Prominent_Words_Unindexed_Post_Query_Double */
	protected $class_instance;

	/**
	 * Sets the instance of the class.
	 */
	public function setUp() {
		parent::setUp();

		require_once WPSEO_TESTS_PATH . '/premium/doubles/premium-prominent-words-unindexed-post-query-double.php';

		$this->class_instance = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query_Double();
	}

	/**
	 * Remove the custom post type after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		// Remove possibly set post type.
		unregister_post_type( 'custom-post-type' );
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
		$this->assertEquals( 0, $this->class_instance->get_total( 'posts' ) );
	}

	/**
	 * Tests get_total with a couple of posts present.
	 */
	public function test_get_total_with_posts() {
		$posts = $this->factory()->post->create_many( 10 );

		foreach ( $posts as $post_id ) {
			delete_post_meta( $post_id, WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME );
		}

		$this->assertEquals( 10, $this->class_instance->get_total( 'posts' ) );
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

		$this->assertEquals( 10, $this->class_instance->get_total( 'posts' ) );
		$this->assertEquals( 8, $this->class_instance->get_total( 'pages' ) );
	}

	/**
	 * Tests get_totals with a couple of posts present.
	 */
	public function test_totals() {
		$this->factory()->post->create_many( 10 );
		$this->factory()->post->create_many( 8, array( 'post_type' => 'page' ) );

		$this->assertEquals( array( 'posts' => 10, 'pages' => 8 ), $this->class_instance->get_totals( array( 'post', 'page' ) ) );
	}

	/**
	 * Tests determine_rest_endpoint_for_post_type for default types.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::determine_rest_endpoint_for_post_type()
	 */
	public function test_determine_rest_endpoint_default_types() {
		$this->assertEquals( 'posts', $this->class_instance->determine_rest_endpoint_for_post_type( 'post' ) );
		$this->assertEquals( 'pages', $this->class_instance->determine_rest_endpoint_for_post_type( 'page' ) );
	}

	/**
	 * Tests determine_rest_endpoint_for_post_type for unknown types.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::determine_rest_endpoint_for_post_type()
	 */
	public function test_determine_rest_endpoint_faulty_post_type() {
		$this->assertEquals( '', $this->class_instance->determine_rest_endpoint_for_post_type( 'unknown' ) );
	}

	/**
	 * Tests determine_rest_endpoint_for_post_type for custom type without a rest_base being set.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::determine_rest_endpoint_for_post_type()
	 */
	public function test_determine_rest_endpoint_custom_types_without_base_set() {
		register_post_type( 'custom-post-type',
			array(
				'public' => true,
				'labels' => array( 'name' => 'custom-post-type'	),
				'show_in_rest' => true,
			)
		);

		$this->assertEquals( 'custom-post-type', $this->class_instance->determine_rest_endpoint_for_post_type( 'custom-post-type' ) );
	}

	/**
	 * Tests determine_rest_endpoint_for_post_type for custom type where no rest_base and name is set.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::determine_rest_endpoint_for_post_type()
	 */
	public function test_determine_rest_endpoint_custom_types_without_base_and_name_set() {
		register_post_type( 'custom-post-type',	array( 'public' => true, 'show_in_rest' => true ) );

		$this->assertEquals( 'custom-post-type', $this->class_instance->determine_rest_endpoint_for_post_type( 'custom-post-type' ) );
	}

	/**
	 * Tests determine_rest_endpoint_for_post_type for custom types where the rest_base is set.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::determine_rest_endpoint_for_post_type()
	 */
	public function test_determine_rest_endpoint_custom_types_with_base_set() {
		register_post_type( 'custom-post-type',
			array(
				'public' => true,
				'name' => 'custom-post-type',
				'rest_base' => 'custom',
				'show_in_rest' => true,
			)
		);

		$this->assertEquals( 'custom', $this->class_instance->determine_rest_endpoint_for_post_type( 'custom-post-type' ) );
	}

}
