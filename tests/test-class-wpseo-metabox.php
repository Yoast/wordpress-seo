<?php

class WPSEO_Metabox_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Metabox
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Metabox;
	}

	/**
	* @covers WPSEO_Metabox::get_post_date()
	*/
	public function test_get_post_date() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$post = get_post( $post_id );

		$expected_date = date( 'j M Y', strtotime( $post->post_date ) );
		$this->assertEquals( $expected_date, self::$class_instance->get_post_date( $post ) );
	}

	/**
	* @covers WPSEO_Metabox::enqueue()
	*/
	public function test_enqueue_not_firing_on_options_page() {
		global $pagenow;
		$pagenow = 'options.php';

		// call enqueue function
		self::$class_instance->enqueue();

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
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( 'wp-seo-metabox', 'enqueued' );
		$this->assertTrue( $enqueued );
	}

	public function test_column_heading_is_hooked() {

		self::$class_instance->setup_page_analysis();
		// @todo -> is this double ! correct ?
		$hooked = !! has_filter( 'manage_post_posts_columns', array( self::$class_instance, 'column_heading' ) );

		$this->assertTrue( $hooked );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_score( ) {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_focuskw( ) {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	* @covers WPSEO_Metabox::column_heading()
	*/
	public function test_column_heading_has_metadesc( ) {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	* @covers WPSEO_Metabox::strtolower_utf8()
	*/
	public function test_strtolower_utf8() {
		$input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЪЬЭЮЯĄĆĘŁŃÓŚŹŻ';
		$expected_output = 'abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýабвгдеёжзийклмнопрстуфхцчшщъъьэюяąćęłńóśźż';
		$this->assertEquals( $expected_output, self::$class_instance->strtolower_utf8( $input ) );
	}

	public function test_add_metabox() {
		global $wp_meta_boxes;

		self::$class_instance->add_meta_box();

		$post_types = get_post_types( array( 'public' => true ) );

		// test if all post types have the wpseo_meta metabox
		foreach ( $post_types as $post_type ) {
			$this->assertArrayHasKey( 'wpseo_meta', $wp_meta_boxes[$post_type]['normal']['high'] );
		}
	}

	public function test_save_postdata() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$post = get_post( $post_id );

		// setup
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

		// vars
		$meta_fields = apply_filters( 'wpseo_save_metaboxes', array() );
		$meta_fields = array_merge(
			$meta_fields,
			self::$class_instance->get_meta_field_defs( 'general', $post->post_type ),
			self::$class_instance->get_meta_field_defs( 'advanced' )
		);

		// set $_POST data to be saved
		foreach ( $meta_fields as $key => $field ) {

			// set text fields
			if ( $field['type'] === 'text' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'text';
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'on';
			}
		}

		// call method that saves the $_POST data
		self::$class_instance->save_postdata( $post->ID );

		// check if output matches
		$custom = get_post_custom( $post->ID );
		foreach ( $meta_fields as $key => $field ) {

			if ( ! isset( $custom[ WPSEO_Metabox::$meta_prefix . $key ][0] ) ) {
				continue;
			}

			$value = $custom[ WPSEO_Metabox::$meta_prefix . $key ][0];

			// set text fields
			if ( $field['type'] === 'text' ) {
				$this->assertNotEmpty( $value );
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$this->assertEquals( $value, 'on' );
			}
		}
	}



}