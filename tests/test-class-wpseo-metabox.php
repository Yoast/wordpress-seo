<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Metabox_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Metabox
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_Metabox();
	}

	/**
	 * Tests that on certain pages, assets are not enqueued.
	 *
	 * @covers WPSEO_Metabox::enqueue()
	 */
	public function test_enqueue_not_firing_on_options_page() {
		global $pagenow;
		$pagenow = 'options.php';

		// Call enqueue function.
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( 'wp-seo-metabox', 'enqueued' );
		$this->assertFalse( $enqueued );
	}

	/**
	 * Tests that enqueuing the necessary assets, works.
	 *
	 * @covers WPSEO_Metabox::enqueue()
	 */
	public function test_enqueue_firing_on_new_post_page() {
		global $pagenow;
		$pagenow = 'post-new.php';

		// Prefix used in WPSEO-admin-asset-manager.

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->register_assets();


		// Call enqueue function.
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'enqueued' );
		$this->assertTrue( $enqueued );
	}

	/**
	 * Tests that adding of valid metaboxes works properly.
	 *
	 * @covers WPSEO_Metabox::add_meta_box
	 */
	public function test_add_metabox() {
		global $wp_meta_boxes;

		$stub = $this
			->getMockBuilder( 'WPSEO_Metabox' )
			->setMethods( array( 'is_metabox_hidden' ) )
			->getMock();

		$stub
			->expects( $this->any() )
			->method( 'is_metabox_hidden' )
			->will( $this->returnValue( false ) );

		$stub->add_meta_box();

		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		unset( $post_types['attachment'] );

		// Test if all post types have the wpseo_meta metabox.
		foreach ( $post_types as $post_type ) {
			$this->assertArrayHasKey( 'wpseo_meta', $wp_meta_boxes[ $post_type ]['normal']['high'] );
		}
	}

	/**
	 * Tests that saving postdata works properly.
	 *
	 * @covers WPSEO_Metabox::save_postdata
	 */
	public function test_save_postdata() {

		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$post = get_post( $post_id );

		// Setup.
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin();

		// Vars.
		$meta_fields = apply_filters( 'wpseo_save_metaboxes', array() );
		$meta_fields = array_merge(
			$meta_fields,
			self::$class_instance->get_meta_field_defs( 'general', $post->post_type ),
			self::$class_instance->get_meta_field_defs( 'advanced' )
		);

		// Set $_POST data to be saved.
		foreach ( $meta_fields as $key => $field ) {

			// Set text fields.
			if ( $field['type'] === 'text' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'text';
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$_POST[ WPSEO_Metabox::$form_prefix . $key ] = 'on';
			}
		}

		// Call method that saves the $_POST data.
		self::$class_instance->save_postdata( $post->ID );

		// Check if output matches.
		$custom = get_post_custom( $post->ID );
		foreach ( $meta_fields as $key => $field ) {

			if ( ! isset( $custom[ WPSEO_Metabox::$meta_prefix . $key ][0] ) ) {
				continue;
			}

			$value = $custom[ WPSEO_Metabox::$meta_prefix . $key ][0];

			// Set text fields.
			if ( $field['type'] === 'text' ) {
				$this->assertNotEmpty( $value );
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$this->assertEquals( $value, 'on' );
			}
		}
	}
}
