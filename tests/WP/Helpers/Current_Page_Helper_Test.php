<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Integration Test Class for the Current_Page_Helper class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Helpers\Current_Page_Helper
 */
final class Current_Page_Helper_Test extends TestCase {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The query wrapper.
	 *
	 * @var WP_Query_Wrapper
	 */
	private $query_wrapper;

	/**
	 * Whether we show the alternate message.
	 *
	 * @var bool
	 */
	private $show_alternate_message;

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
		$this->options_helper         = new Options_Helper();
		$this->query_wrapper          = new WP_Query_Wrapper();
		$this->show_alternate_message = false;

		$this->instance = new Current_Page_Helper( $this->query_wrapper );
	}

	public function test_get_term_id() {
		\register_taxonomy( 'test_tax_cat', 'post' );

		\wp_insert_term( 'test1', 'test_tax_cat' );
		$id = \get_term_by( 'name', 'test1', 'test_tax_cat' );

		// Set queried object to the newly created post.
		global $wp_the_query;
		$wp_the_query->queried_object = (object) [
			'term_id'  => $id,
		];

		$this->assertEquals( $id, $this->instance->get_term_id() );

		\wp_insert_term( 'test_cat', 'category' );
		$id2 = \get_term_by( 'name', 'test_cat', 'category' );

		$wp_the_query->queried_object = (object) [
			'term_id'  => $id2,
		];

		$this->assertEquals( $id2, $this->instance->get_term_id() );

		\wp_insert_term( 'test_tag', 'tag' );
		$id3 = \get_term_by( 'name', 'test_tag', 'tag' );

		$wp_the_query->queried_object = (object) [
			'term_id'  => $id3,
		];

		$this->assertEquals( $id3, $this->instance->get_term_id() );

		\wp_insert_term( 'test_tag', 'tagss' );
		$id3 = \get_term_by( 'name', 'test_tag', 'tagss' );

		$wp_the_query->queried_object = (object) [
			'term_id'  => $id3,
		];

		$this->assertEquals( $id3, $this->instance->get_term_id() );
	}
}
