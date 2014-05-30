<?php

class WPSEO_Meta_Test extends WPSEO_UnitTestCase {

	/**
	* @covers WPSEO_Meta::set_value()
	*/
	public function test_set_value() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		WPSEO_Meta::set_value('test_set_value_key', 'test_set_value_value', $post_id );
		$this->assertEquals( 'test_set_value_value', get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'test_set_value_key', true ) );
	}

	/**
	* @covers WPSEO_Meta::get_value()
	*/
	public function test_get_value() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		update_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'test_get_value_key', 'test_get_value_value' );

		$this->assertEquals( 'test_get_value_value', WPSEO_Meta::get_value('test_get_value_key') );

		// TODO test for defaults

		// TODO test if non-existing keys return an empty string
	}

	/**
	* Test if default meta values are removed when updating post_meta
	* @covers WPSEO_Meta::remove_meta_if_default
	*/
	public function test_remove_meta_if_default() {
		// create and go to post
		$post_id = $this->factory->post->create();

		// generate key
		$key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';

		// set post meta to default value
		$default_value = WPSEO_Meta::$defaults[$key];
		update_post_meta( $post_id, $key, $default_value );

		// default post meta should not be saved
		$meta_value = get_post_meta( $post_id, $key, true );
		$this->assertEquals('', $meta_value );
	}

	/**
	* Test if default meta values aren't saved when updating post_meta
	* @covers WPSEO_Meta::dont_save_meta_if_default
	*/
	public function test_dont_save_meta_if_default() {
		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// generate key
		$key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';

		// add default value to post_meta
		$default_value = WPSEO_Meta::$defaults[$key];
		add_post_meta( $post_id, $key, $default_value );

		// default post meta should not be saved
		$meta_value = get_post_meta( $post_id, $key );
		$this->assertEquals( array(), $meta_value );
	}

	/**
	* @covers WPSEO_Meta::meta_value_is_default
	*/
	public function test_meta_value_is_default() {
		$meta_key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';
		$meta_value = WPSEO_Meta::$defaults[ $meta_key ];

		$this->assertTrue( WPSEO_Meta::meta_value_is_default( $meta_key, $meta_value ) );
	}

	/**
	* Test if two arrays are recursively merged, the latter overwriting the first.
	*
	* @covers WPSEO_Meta::array_merge_recursive_distinct
	*/
	public function test_array_merge_recursive_distinct() {

		$inputArray1 = array(
			'one' => array(
				'one-one' => array()
			)
		);

		$inputArray2 = array(
			'one' => array(
				'one-one' => 'string'
			)
		);

		$output = WPSEO_Meta::array_merge_recursive_distinct( $inputArray1, $inputArray2 );
		$this->assertEquals( $output['one']['one-one'], 'string');
	}

	/**
	* @covers WPSEO_Meta::validate_meta_robots_adv
	*/
	public function test_validate_meta_robots_adv() {

		// none should take precedence
		$this->assertEquals( 'none', WPSEO_Meta::validate_meta_robots_adv( 'none, something-invalid, noarchive' ) );
		$this->assertEquals( 'none', WPSEO_Meta::validate_meta_robots_adv( array( 'none', 'something-invalid', 'noarchive' ) ) );

		// - should take precedence
		$this->assertEquals( '-', WPSEO_Meta::validate_meta_robots_adv( '-, something-invalid, noarchive' ) );
		$this->assertEquals( '-', WPSEO_Meta::validate_meta_robots_adv( array( '-', 'something-invalid', 'noarchive' ) ) );

		// string should be cleaned
		$this->assertEquals( 'noarchive,nosnippet', WPSEO_Meta::validate_meta_robots_adv( 'noarchive, nosnippet' ) );
		$this->assertEquals( 'noarchive,nosnippet', WPSEO_Meta::validate_meta_robots_adv( array( 'noarchive', 'nosnippet' ) ) );

	}


}