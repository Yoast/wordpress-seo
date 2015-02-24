<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
 */

class WPSEO_Functions_Test extends WPSEO_UnitTestCase {

	/**
	* Provision some options
	*/
	public function setUp() {
		parent::setUp();
	}

	public function test_wpseo_add_capabilities() {
		// TODO
	}

	public function test_wpseo_remove_capabilities() {

	}

	/**
	 * @covers wpseo_replace_vars
	 */
	public function test_wpseo_replace_vars() {

		// create author
		$user_id = $this->factory->user->create(
			array(
				'user_login'   => 'User_Login',
				'display_name' => 'User_Nicename',
			)
		);

		// create post
		$post_id = $this->factory->post->create(
			array(
				'post_title'   => 'Post_Title',
				'post_content' => 'Post_Content',
				'post_excerpt' => 'Post_Excerpt',
				'post_author'  => $user_id,
				'post_date'    => date( 'Y-m-d H:i:s', strtotime( '2000-01-01 2:30:00' ) ),
			)
		);

		// get post
		$post = get_post( $post_id );

		$input    = '%%title%% %%excerpt%% %%date%% %%name%%';
		$expected = 'Post_Title Post_Excerpt ' . mysql2date( get_option( 'date_format' ), $post->post_date, true ) . ' User_Nicename';
		$output   = wpseo_replace_vars( $input, (array) $post );
		$this->assertEquals( $expected, $output );

		/*
			TODO
			- Test all Basic Variables
			- Test all Advanced Variables
		 */
	}

	public function test_wpseo_get_terms() {
		// TODO
	}

	public function test_wpseo_strip_shortcodes() {
		// TODO
	}

	public function test_wpseo_wpml_config() {
		// TODO
	}
}