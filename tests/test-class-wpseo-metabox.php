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

	/**
	* @covers WPSEO_Metabox::get_post_date()
	*/
	public function test_get_post_date() {
		$expected_date = date( 'j M Y', strtotime( $this->post->post_date ) );
		$this->assertEquals( $expected_date, $this->metabox->get_post_date( $this->post ) );
	}
		
	/**
	* @covers WPSEO_Metabox::enqueue()
	*/
	public function test_enqueue_not_firing_on_options_page() {
		global $pagenow;
		$pagenow = 'options.php';

		// call enqueue function
		$this->metabox->enqueue();

		$enqueued = wp_script_is( 'wp-seo-metabox', 'enqueued' );
		$this->assertFalse( $enqueued );		
	}

	/**
	* @covers WPSEO_Metabox::enqueue()
	*/
	public function test_enqueue_firing_on_new_post_page() {
		global $pagenow;
		$pagenow = 'post-new.php';

		// call enqueue function
		$this->metabox->enqueue();

		$enqueued = wp_script_is( 'wp-seo-metabox', 'enqueued' );
		$this->assertTrue( $enqueued );		
	}

	public function test_column_heading_is_hooked() {

		$this->metabox->setup_page_analysis();
		$hooked = !! has_filter( 'manage_post_posts_columns', array( $this->metabox, 'column_heading') );

		$this->assertTrue( $hooked );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_score( ) {
		$columns = $this->metabox->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_focuskw( ) {
		$columns = $this->metabox->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_metadesc( ) {
		$columns = $this->metabox->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	* @covers WPSEO_Metabox::strtolower_utf8()
	*/
	public function test_strtolower_utf8() {
		$input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЪЬЭЮЯĄĆĘŁŃÓŚŹŻ';
		$expected_output = 'abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýабвгдеёжзийклмнопрстуфхцчшщъъьэюяąćęłńóśźż';
		$this->assertEquals( $expected_output, $this->metabox->strtolower_utf8( $input ) );
	}

	public function test_add_metabox() {
		global $wp_meta_boxes;

		$this->metabox->add_meta_box();

		$post_types = get_post_types( array( 'public' => true ) );

		// test if all post types have the wpseo_meta metabox
		foreach( $post_types as $post_type) {
			$this->assertArrayHasKey( 'wpseo_meta', $wp_meta_boxes[$post_type]['normal']['high'] );
		}
	}



}