<?php

class WPSEO_Meta_Test extends WPSEO_UnitTestCase {

	private $_post;

	/**
	* Setup shared fixtures
	*/
	public function setUp() {
		parent::setUp();

		// Create a sample post
		$post_id = $this->factory->post->create( 
			array( 
				'post_title' => 'Sample Post', 
				'post_type' => 'post', 
				'post_status' => 'publish' 
			) 
		);

		// Add some meta values
		$this->meta_in = array(
			'focuskw' => 'focuskw',
			'canonical' => 'canonical',
			'redirect' => 'redirect',
			'meta-robots-adv' => array( 'noodp', 'noydir', 'noarchive', 'nosnippet' )
		);

		foreach( $this->meta_in as $key => $value ) {
			WPSEO_Meta::set_value( $key, $value, $post_id );
		}

		// Store post object
		global $post;
		$this->_post = $post = get_post( $post_id );
	}

	/**
	* Test if 'linkdex' equals its default (0)
	*/
	public function test_linkdex_is_default() {
		$value = WPSEO_Meta::get_value( 'linkdex' );
		$this->assertEquals( '0', $value );
	}

	/**
	* Test if 'canonical' was prefixed with http
	*/
	public function test_canonical_contains_http() {
		$value = WPSEO_Meta::get_value( 'canonical', $this->_post->ID );
		$this->assertContains( 'http', $value );
	}

	/**
	* Test if 'redirect' was prefixed with http
	*/
	public function test_redirect_contains_http() {
		$value = WPSEO_Meta::get_value( 'redirect', $this->_post->ID );
		$this->assertContains( 'http', $value );
	}

	/**
	* Test if 'meta-robots-ads' was correctly populated
	*/
	public function test_meta_robots_adv_values() {
		$value = WPSEO_Meta::get_value( 'meta-robots-adv' );
		$this->assertEquals( implode( ',', $this->meta_in['meta-robots-adv'] ), $value );
	}

	/**
	* Test if the 'meta-robots-ads' option defaults to 'none' if multiple values are given as input
	*/
	public function test_meta_robots_adv_defaults_to_none() {
		// update meta value
		WPSEO_Meta::set_value( 'meta-robots-adv', array( 'none' ,'noydir', 'noydir', 'noarchive', 'nosnippet' ), $this->_post->ID );
		$value = WPSEO_Meta::get_value( 'meta-robots-adv' );

		// meta value should be set to 'none' now
		$this->assertEquals( 'none', $value );
	}

	/**
	* Test if default meta values are removed when updating post_meta
	* @covers WPSEO_Meta::remove_meta_if_default
	*/
	public function test_remove_meta_if_default() {
		// generate key
		$key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';

		// set post meta to default value
		$default_value = WPSEO_Meta::$defaults[$key];
		update_post_meta( $this->_post->ID, $key, $default_value );

		// default post meta should not be saved
		$meta_value = get_post_meta( $this->_post->ID, $key, true );
		$this->assertEquals('', $meta_value );
	}

	/**
	* Test if default meta values aren't saved when updating post_meta
	* @covers WPSEO_Meta::dont_save_meta_if_default()
	*/
	public function test_dont_save_meta_if_default() {
		// generate key
		$key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';

		// add default value to post_meta
		$default_value = WPSEO_Meta::$defaults[$key];
		add_post_meta( $this->_post->ID, $key, $default_value );

		// default post meta should not be saved
		$meta_value = get_post_meta( $this->_post->ID, $key );
		$this->assertEquals(array(), $meta_value );
	}

	/**
	* @covers WPSEO_Meta::meta_value_is_default()
	*/
	public function test_meta_value_is_default() {
		$meta_key = WPSEO_Meta::$meta_prefix . 'sitemap-html-include';
		$meta_value = WPSEO_Meta::$defaults[ $meta_key ];

		$this->assertTrue( WPSEO_Meta::meta_value_is_default( $meta_key, $meta_value ) );
	}


	/**
	* Test if two arrays are recursively merged, the latter overwriting the first.
	*
	* @covers WPSEO_Meta::array_merge_recursive_distinct()
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

	
}