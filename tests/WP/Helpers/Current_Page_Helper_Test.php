<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Integration Test Class for the Current_Page_Helper class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Helpers\Current_Page_Helper
 */
final class Current_Page_Helper_Test extends TestCase {

	/**
	 * The query wrapper.
	 *
	 * @var WP_Query_Wrapper
	 */
	private $query_wrapper;

	/**
	 * The instance.
	 *
	 * @var Current_Page_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->query_wrapper = new WP_Query_Wrapper();
		$this->instance      = new Current_Page_Helper( $this->query_wrapper );
	}

	/**
	 * Tests if the id of a custom taxonomy is correctly retrieved.
	 *
	 * @covers ::get_term_id
	 * @return void
	 */
	public function test_get_term_id_for_custom_taxonomy() {
		\register_taxonomy( 'custom_taxonomy', 'post' );

		\wp_insert_term( 'test', 'custom_taxonomy' );
		$term = \get_term_by( 'name', 'test', 'custom_taxonomy' );

		global $wp_the_query;
		$wp_the_query->queried_object = (object) [
			'term_id'  => $term->term_id,
		];

		$wp_the_query->is_tax = true;

		$this->assertEquals( $term->term_id, $this->instance->get_term_id() );
	}

	/**
	 * Tests if the id of a category is correctly retrieved.
	 *
	 * @covers ::get_term_id
	 * @return void
	 */
	public function test_get_term_id_for_category() {
		global $wp_the_query;

		\wp_insert_term( 'test_cat', 'category' );
		$category = \get_term_by( 'name', 'test_cat', 'category' );

		$wp_the_query->queried_object = (object) [
			'term_id'  => $category->term_id,
		];

		$wp_the_query->is_category       = true;
		$wp_the_query->query_vars['cat'] = $category->term_id;

		$this->assertEquals( $category->term_id, $this->instance->get_term_id() );
	}

	/**
	 * Tests if the id of a post tag is correctly retrieved.
	 *
	 * @covers ::get_term_id
	 * @return void
	 */
	public function test_get_term_id_for_post_tag() {
		global $wp_the_query;

		\wp_insert_term( 'test_tag', 'post_tag' );
		$tag = \get_term_by( 'name', 'test_tag', 'post_tag' );

		$wp_the_query->queried_object = (object) [
			'term_id'  => $tag->term_id,
		];

		$wp_the_query->is_tag               = true;
		$wp_the_query->query_vars['tag_id'] = $tag->term_id;

		$this->assertEquals( $tag->term_id, $this->instance->get_term_id() );
	}
}
