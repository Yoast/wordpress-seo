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
			'meta-robots-adv' => array('noodp', 'noydir', 'noarchive', 'nosnippet')
		);

		foreach( $this->meta_in as $key => $value ) {
			WPSEO_Meta::set_value($key, $value, $post_id);
		}

		// Store post object
		global $post;
		$this->_post = $post = get_post( $post_id );
	}

	public function test_linkdex_is_default() {
		$value = WPSEO_Meta::get_value('linkdex');
		$this->assertEquals('0', $value);
	}

	public function test_canonical_contains_http() {
		$value = WPSEO_Meta::get_value('canonical', $this->_post->ID);

		$this->assertContains('http', $value);
	}

	public function test_redirect_contains_http() {
		$value = WPSEO_Meta::get_value('redirect', $this->_post->ID);
		$this->assertContains('http', $value);
	}

	public function test_meta_robots_adv_values() {
		$value = WPSEO_Meta::get_value('meta-robots-adv');
		$this->assertEquals(implode(',', $this->meta_in['meta-robots-adv']), $value);
	}

	public function test_meta_robots_adv_defaults_to_none() {
		// update meta value
		WPSEO_Meta::set_value('meta-robots-adv', array('none' ,'noydir', 'noydir', 'noarchive', 'nosnippet'), $this->_post->ID );
		$value = WPSEO_Meta::get_value('meta-robots-adv');

		// meta value should be set to 'none' now
		$this->assertEquals('none', $value);
	}

	
}