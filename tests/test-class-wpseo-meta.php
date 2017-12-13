<?php
/**
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Meta_Test extends WPSEO_UnitTestCase {

	/**
	 * @covers WPSEO_Meta::set_value()
	 */
	public function test_set_value() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value( 'test_set_value_key', 'test_set_value_value', $post_id );
		$this->assertEquals( 'test_set_value_value', get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'test_set_value_key', true ) );
	}

	/**
	 * @covers WPSEO_Meta::get_value()
	 */
	public function test_get_value() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'test_get_value_key', 'test_get_value_value' );

		$this->assertEquals( 'test_get_value_value', WPSEO_Meta::get_value( 'test_get_value_key' ) );

		// @todo Test for defaults.

		// @todo Test if non-existing keys return an empty string.
	}

	/**
	 * Test if default meta values are removed when updating post_meta.
	 * @covers WPSEO_Meta::remove_meta_if_default
	 */
	public function test_remove_meta_if_default() {
		// Create and go to post.
		$post_id = $this->factory->post->create();

		// Generate key.
		$key = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';

		// Set post meta to default value.
		$default_value = WPSEO_Meta::$defaults[ $key ];
		update_post_meta( $post_id, $key, $default_value );

		// Default post meta should not be saved.
		$meta_value = get_post_meta( $post_id, $key, true );
		$this->assertEquals( '', $meta_value );
	}

	/**
	 * Test if default meta values aren't saved when updating post_meta.
	 * @covers WPSEO_Meta::dont_save_meta_if_default
	 */
	public function test_dont_save_meta_if_default() {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// Generate key.
		$key = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';

		// Add default value to post_meta.
		$default_value = WPSEO_Meta::$defaults[ $key ];
		add_post_meta( $post_id, $key, $default_value );

		// Default post meta should not be saved.
		$meta_value = get_post_meta( $post_id, $key );
		$this->assertEquals( array(), $meta_value );
	}

	/**
	 * @covers WPSEO_Meta::meta_value_is_default
	 */
	public function test_meta_value_is_default() {
		$meta_key   = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';
		$meta_value = WPSEO_Meta::$defaults[ $meta_key ];

		$this->assertTrue( WPSEO_Meta::meta_value_is_default( $meta_key, $meta_value ) );
	}

	/**
	 * Test if two arrays are recursively merged, the latter overwriting the first.
	 *
	 * @covers WPSEO_Meta::array_merge_recursive_distinct
	 */
	public function test_array_merge_recursive_distinct() {

		$input_array1 = array(
			'one' => array(
				'one-one' => array(),
			),
		);

		$input_array2 = array(
			'one' => array(
				'one-one' => 'string',
			),
		);

		$output = WPSEO_Meta::array_merge_recursive_distinct( $input_array1, $input_array2 );
		$this->assertEquals( $output['one']['one-one'], 'string' );
	}

	/**
	 * @covers WPSEO_Meta::validate_meta_robots_adv
	 */
	public function test_validate_meta_robots_adv() {

		// None should take precedence.
		$this->assertEquals( 'none', WPSEO_Meta::validate_meta_robots_adv( 'none, something-invalid, noarchive' ) );
		$this->assertEquals( 'none', WPSEO_Meta::validate_meta_robots_adv( array( 'none', 'something-invalid', 'noarchive' ) ) );

		// - should take precedence.
		$this->assertEquals( '-', WPSEO_Meta::validate_meta_robots_adv( '-, something-invalid, noarchive' ) );
		$this->assertEquals( '-', WPSEO_Meta::validate_meta_robots_adv( array( '-', 'something-invalid', 'noarchive' ) ) );

		// String should be cleaned.
		$this->assertEquals( 'noarchive,nosnippet', WPSEO_Meta::validate_meta_robots_adv( 'noarchive, nosnippet' ) );
		$this->assertEquals( 'noarchive,nosnippet', WPSEO_Meta::validate_meta_robots_adv( array( 'noarchive', 'nosnippet' ) ) );

	}

	/**
	 * Test value returned when valid $_POST key supplied.
	 * @covers WPSEO_Meta::get_post_value
	 */
	public function test_get_post_value() {
		$key   = 'my_test_key';
		$value = 'my_test_key_value';
		$this->set_post( $key, $value );

		$this->assertEquals( $value, WPSEO_Meta::get_post_value( $key ) );
	}

	/**
	 * Test default value returned when non-existant $_POST key supplied.
	 * @covers WPSEO_Meta::get_post_value
	 */
	public function test_get_post_value_default() {
		$this->assertEquals( '', WPSEO_Meta::get_post_value( 'my_missing_test_key' ) );
	}
}
