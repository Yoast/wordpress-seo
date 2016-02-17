<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Recalculate_Scores_Ajax_Test extends WPSEO_UnitTestCase {

	private $instance;

	private $posts = array();

	/**
	 * Setup the class instance and create some posts
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Recalculate_Scores_Ajax();

		$this->posts = array(
			1 => $this->factory->post->create( array( 'post_title' => 'Post with focus keyword' ) ),
			2 => $this->factory->post->create( array( 'post_title' => 'Test Post 2' ) ),
			3 => $this->factory->post->create( array( 'post_title' => 'Test Post 3' ) ),
		);
	}

	/**
	 *
	 */
	public function test_get_total() {
		add_filter( 'wp_die_handler', array( $this, 'set_total_response_no_posts' ) );

		$ajax_nonce = wp_create_nonce( "wpseo_recalculate" );
		$_REQUEST['nonce'] = $ajax_nonce;

		$this->instance->get_total();

		remove_filter( 'wp_die_handler', array( $this, 'set_total_response_no_posts' ) );
	}

	public function set_total_response_no_posts( $response ) {
		return array($this, 'get_total_response_no_posts');
	}

	public function get_total_response_no_posts( $response ) {
		$object = json_decode($response);
		$this->assertEquals( 0, $object->posts );
	}

	/**
	 *
	 */
	public function test_get_total_with_posts() {
		add_filter( 'wp_die_handler', array( $this, 'set_total_response_two_posts' ) );

		$ajax_nonce = wp_create_nonce( "wpseo_recalculate" );
		$_REQUEST['nonce'] = $ajax_nonce;

		WPSEO_Meta::set_value( 'focuskw', 'focus keyword', $this->posts[1] );
		WPSEO_Meta::set_value( 'focuskw', 'testable', $this->posts[3] );

		$this->instance->get_total();

		remove_filter( 'wp_die_handler', array( $this, 'set_total_response_two_posts' ) );
	}

	public function set_total_response_two_posts( $response ) {
		return array($this, 'get_total_response_two_posts');
	}

	public function get_total_response_two_posts( $response ) {
		$object = json_decode($response);
		$this->assertEquals( 2, $object->posts );
	}

	/**
	 * Recalculate scores
	 */

	/**
	 * Save scores
	 */
}