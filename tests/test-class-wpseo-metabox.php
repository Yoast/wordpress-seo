<?php

class WPSEO_Metabox_Test extends WPSEO_UnitTestCase {

	private $post;
	private $metabox;

	/**
	* Setup test fixtures
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

		// store post and metabox object
		global $post, $wpseo_metabox;
		$this->metabox = $wpseo_metabox = new WPSEO_Metabox;
		$this->post = get_post( $post_id );
	}



	/**
	* Placeholder test to prevent PHPUnit throwing warnings.
	*/
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}
	
}