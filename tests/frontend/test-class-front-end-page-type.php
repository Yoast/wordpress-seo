<?php
/**
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Frontend_Page_Type_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Frontend_Page_Type */
	protected $frontend_page_type;

	/**
	 * Sets the frontend page type object.
	 *
	 * @return void;
	 */
	public function setUp(  ) {
		parent::setUp();

		$this->frontend_page_type = new WPSEO_Frontend_Page_Type();
	}

	/**
	 * Tests the situation where nothing has been done to manipulate the result.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_simple_page()
	 * @covers WPSEO_Frontend_Page_Type::get_simple_page_id()
	 */
	public function test_simple_page_default_state() {
		$this->assertFalse( $this->frontend_page_type->is_simple_page() );
		$this->assertEquals( 0, $this->frontend_page_type->get_simple_page_id() );
	}

	/**
	 * Tests the situation where a single post will be visited.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_simple_page()
	 * @covers WPSEO_Frontend_Page_Type::get_simple_page_id()
	 */
	public function test_simple_page_with_a_post_being_visited() {
		$post = $this->factory()->post->create_and_get();

		$this->go_to( get_permalink( $post ) );
		$this->assertTrue( $this->frontend_page_type->is_simple_page() );
		$this->assertEquals(  $post->ID, $this->frontend_page_type->get_simple_page_id() );
	}

	/**
	 * Tests the situation where a page that is set as home will be visited.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_simple_page()
	 * @covers WPSEO_Frontend_Page_Type::get_simple_page_id()
	 */
	public function test_simple_page_with_a_page_set_as_home_page_being_visited() {
		$current_page_for_posts = get_option( 'page_for_posts' );
		$current_show_on_front  = get_option( 'show_on_front' );

		$home_page = $this->factory()->post->create_and_get( array( 'post_type' => 'page' ) );

		update_option( 'show_on_front', 'page' );
		update_option( 'page_for_posts', $home_page->ID );

		$this->go_to( get_permalink( $home_page ) );
		$this->assertTrue( $this->frontend_page_type->is_simple_page() );
		$this->assertEquals(  $home_page->ID, $this->frontend_page_type->get_simple_page_id() );

		update_option( 'show_on_front', $current_show_on_front );
		update_option( 'page_for_posts', $current_page_for_posts );
	}

	/**
	 * Tests the situation where a filter hook has been set.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_simple_page()
	 * @covers WPSEO_Frontend_Page_Type::get_simple_page_id()
	 */
	public function test_simple_page_without_a_set_filter_for_the_id() {
		$this->assertFalse( $this->frontend_page_type->is_simple_page() );
		$this->assertEquals(  0,  $this->frontend_page_type->get_simple_page_id() );
	}

	/**
	 * Tests the situation where a filter hook has been set.
	 *
	 * @covers WPSEO_Frontend_Page_Type::is_simple_page()
	 * @covers WPSEO_Frontend_Page_Type::get_simple_page_id()
	 */
	public function test_simple_page_with_a_set_filter_for_the_id() {
		add_filter( 'wpseo_frontend_page_type_simple_page_id', array( $this, 'simple_page_hook' ) );

		$this->assertTrue( $this->frontend_page_type->is_simple_page() );
		$this->assertEquals(  100,  $this->frontend_page_type->get_simple_page_id() );

		remove_filter( 'wpseo_frontend_page_type_simple_page_id', array( $this, 'simple_page_hook' ) );
	}

	/**
	 * Callback method for the set hook.
	 *
	 * @param int $page_id The given page id.
	 *
	 * @return int The overriden page id.
	 */
	public function simple_page_hook( $page_id ) {
		return 100;
	}


}