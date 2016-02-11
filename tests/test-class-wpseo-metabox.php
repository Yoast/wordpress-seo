<?php
/**
 * @package WPSEO\Unittests
 */

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

		// Create and go to post
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

		// Call enqueue function
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

		// Prefix used in WPSEO-admin-asset-manager

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->register_assets();


		// Call enqueue function
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'enqueued' );
		$this->assertTrue( $enqueued );
	}

	public function test_column_heading_is_hooked() {

		self::$class_instance->setup_page_analysis();
		// @todo -> is this double ! correct ?
		$hooked = ! ! has_filter( 'manage_post_posts_columns', array( self::$class_instance, 'column_heading' ) );

		$this->assertTrue( $hooked );
	}

	/**
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_score() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_focuskw() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_metadesc() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	 * Tests that column_hidden returns the columns to hide so that WordPress hides them
	 *
	 * @covers WPSEO_Metabox::column_hidden()
	 */
	public function test_column_hidden_HIDE_COLUMNS() {
		$user = $this->getMockBuilder( 'WP_User' )
		             ->getMock();

		// Option may be filled if the user has not set it.
		$user->expects( $this->any() )
		     ->method( 'has_prop' )
		     ->will( $this->returnValue( false ) );

		$expected = array( 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' );
		$received = self::$class_instance->column_hidden( array(), 'option-name', $user );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests that column_hidden returns the value WordPress has saved in the database
	 *
	 * This is so the user can still set the columns they want to hide.
	 *
	 * @covers WPSEO_Metabox::column_hidden()
	 */
	public function test_column_hidden_KEEP_OPTION() {

		// Option shouldn't be touched if the user has set it already.
		$user = $this->getMockBuilder( 'WP_User' )
					 ->getMock();

		$user->expects( $this->any() )
			 ->method( 'has_prop' )
			 ->will( $this->returnValue( true ) );

		$expected = array( 'wpseo-title' );
		$received = self::$class_instance->column_hidden( $expected, 'option-name', $user );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests if column_hidden can deal with non array values returned from WordPress
	 *
	 * @covers WPSEO_Metabox::column_hidden()
	 */
	public function test_column_hidden_UNEXPECTED_VALUE() {
		$user = $this->getMockBuilder( 'WP_User' )
					 ->getMock();

		$user->expects( $this->any() )
			 ->method( 'has_prop' )
			 ->will( $this->returnValue( false ) );

		$expected = array( 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' );

		$received = self::$class_instance->column_hidden( false, 'option-name', $user );
		$this->assertEquals( $expected, $received );

		$received = self::$class_instance->column_hidden( 'bad-value', 'option-name', $user );
		$this->assertEquals( $expected, $received );
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

		// Test if all post types have the wpseo_meta metabox
		foreach ( $post_types as $post_type ) {
			$this->assertArrayHasKey( 'wpseo_meta', $wp_meta_boxes[ $post_type ]['normal']['high'] );
		}
	}

	public function test_save_postdata() {

		// Create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$post = get_post( $post_id );

		// Setup
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

		// vars
		$meta_fields = apply_filters( 'wpseo_save_metaboxes', array() );
		$meta_fields = array_merge(
			$meta_fields,
			self::$class_instance->get_meta_field_defs( 'general', $post->post_type ),
			self::$class_instance->get_meta_field_defs( 'advanced' )
		);

		// Set $_POST data to be saved
		foreach ( $meta_fields as $key => $field ) {

			// Set text fields
			if ( $field['type'] === 'text' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'text';
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'on';
			}
		}

		// Call method that saves the $_POST data
		self::$class_instance->save_postdata( $post->ID );

		// Check if output matches
		$custom = get_post_custom( $post->ID );
		foreach ( $meta_fields as $key => $field ) {

			if ( ! isset( $custom[ WPSEO_Metabox::$meta_prefix . $key ][0] ) ) {
				continue;
			}

			$value = $custom[ WPSEO_Metabox::$meta_prefix . $key ][0];

			// Set text fields
			if ( $field['type'] === 'text' ) {
				$this->assertNotEmpty( $value );
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$this->assertEquals( $value, 'on' );
			}
		}
	}
}