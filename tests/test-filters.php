<?php
/**
 * @package WPSEO\Unittests
 */

class Filters_Test extends WPSEO_UnitTestCase {

	/**
	 * @var array
	 */
	private $wp_filter;

	public function __construct() {

		parent::__construct();

		global $wp_filter;
		$this->wp_filter = $wp_filter;
	}

	public function test_wp_head() {
		$wp_head = $this->wp_filter['wp_head'];

		$this->assertArrayNotHasKey( 'rel_canonical', $wp_head[10] );
		$this->assertArrayNotHasKey( 'index_rel_link', $wp_head[10] );
		$this->assertArrayNotHasKey( 'start_post_rel_link', $wp_head[10] );
		$this->assertArrayNotHasKey( 'adjacent_posts_rel_link_wp_head', $wp_head[10] );
		$this->assertArrayNotHasKey( 'noindex', $wp_head[1] );
		$this->assertArrayNotHasKey( 'jetpack_og_tags', $wp_head[10] );
		$this->assertArrayNotHasKey( 'wp_no_robots', $wp_head[10] );
	}

}