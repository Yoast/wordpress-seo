<?php
/**
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

	public function test_add_metabox() {
		global $wp_meta_boxes;

		self::$class_instance->add_meta_box();

		$post_types = WPSEO_Post_Type::get_accessible_post_types();

		// Test if all post types have the wpseo_meta metabox.
		foreach ( $post_types as $post_type ) {
			$this->assertArrayHasKey( 'wpseo_meta', $wp_meta_boxes[ $post_type ]['normal']['high'] );
		}
	}

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
