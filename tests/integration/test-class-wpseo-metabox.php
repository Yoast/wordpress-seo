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
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Metabox
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();

		global $_SERVER;
		$_SERVER['HTTP_USER_AGENT'] = 'User Agent';

		self::$class_instance = new WPSEO_Metabox();
	}

	/**
	 * Tests that on certain pages, assets are not enqueued.
	 *
	 * @covers WPSEO_Metabox::enqueue
	 */
	public function test_enqueue_not_firing_on_options_page() {
		global $pagenow;
		$pagenow = 'options.php';

		// Call enqueue function.
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( 'post-edit', 'enqueued' );
		$this->assertFalse( $enqueued );
	}

	/**
	 * Tests that enqueuing the necessary assets, works.
	 *
	 * @covers WPSEO_Metabox::enqueue
	 */
	public function test_enqueue_firing_on_new_post_page() {
		global $pagenow;
		$pagenow = 'post-new.php';

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->register_assets();

		// Call enqueue function.
		self::$class_instance->enqueue();

		$enqueued = wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'post-edit', 'enqueued' );
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
			->setMethods( [ 'is_metabox_hidden' ] )
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

		$_POST['ID']                       = $post_id;
		$_POST['yoast_free_metabox_nonce'] = wp_create_nonce( 'yoast_free_metabox' );

		// Setup.
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin();

		// Vars.
		$meta_fields = apply_filters( 'wpseo_save_metaboxes', [] );
		$meta_fields = array_merge(
			$meta_fields,
			WPSEO_Meta::get_meta_field_defs( 'general', $post->post_type ),
			WPSEO_Meta::get_meta_field_defs( 'advanced' ),
			WPSEO_Meta::get_meta_field_defs( 'schema', $post->post_type )
		);

		// Set $_POST data to be saved.
		foreach ( $meta_fields as $key => $field ) {

			// Set text fields.
			if ( $field['type'] === 'text' ) {
				$_POST[ WPSEO_Meta::$form_prefix . $key ] = 'text';
			}
			elseif ( $field['type'] === 'hidden' ) {
				$_POST[ WPSEO_Meta::$form_prefix . $key ] = 'hidden';
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$_POST[ WPSEO_Meta::$form_prefix . $key ] = 'on';
			}
		}

		// Call method that saves the $_POST data.
		self::$class_instance->save_postdata( $post->ID );

		// Check if output matches.
		$custom = get_post_custom( $post->ID );
		foreach ( $meta_fields as $key => $field ) {

			if ( ! isset( $custom[ WPSEO_Meta::$meta_prefix . $key ][0] ) ) {
				continue;
			}

			$value = $custom[ WPSEO_Meta::$meta_prefix . $key ][0];

			// Set text fields.
			if ( $field['type'] === 'text' ) {
				$this->assertSame( $value, 'text' );
			}
			elseif ( $field['type'] === 'hidden' ) {
				$this->assertSame( $value, 'hidden' );
			}
			elseif ( $field['type'] === 'checkbox' ) {
				$this->assertSame( $value, 'on' );
			}
		}
	}

	/**
	 * Tests that saving postdata works properly.
	 *
	 * @covers       WPSEO_Metabox::save_postdata
	 *
	 * @dataProvider save_metabox_field_provider
	 *
	 * @param string $field_name     The field name.
	 * @param string $field_value    The field value.
	 * @param string $expected_value The expected value.
	 * @param string $message        The message to show when test fails.
	 */
	public function test_save_postdata_for_separate_fields( $field_name, $field_value, $expected_value, $message ) {
		// Create and go to post.
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$prefixed_field_name = WPSEO_Meta::$form_prefix . $field_name;

		$_POST = [
			'ID'                       => $post_id,
			'post_type'                => 'post',
			$prefixed_field_name       => $field_value,
			'yoast_free_metabox_nonce' => wp_create_nonce( 'yoast_free_metabox' ),
		];

		// Setup.
		$GLOBALS['wpseo_admin'] = new WPSEO_Admin();

		$disabled_advanced_meta = WPSEO_Options::get( 'disableadvanced_meta' );
		WPSEO_Options::set( 'disableadvanced_meta', false );

		// Call method that saves the $_POST data.
		self::$class_instance->save_postdata( $post_id );

		$this->assertEquals( $expected_value, WPSEO_Meta::get_value( $field_name, $post_id ), $message );

		WPSEO_Options::set( 'disableadvanced_meta', $disabled_advanced_meta );
	}

	/**
	 * Provided data to the save metabox test.
	 *
	 * @return array The data to use.
	 */
	public function save_metabox_field_provider() {
		return [
			[
				// Related issue for this case: https://github.com/Yoast/wordpress-seo/issues/14476.
				'field_name'     => 'canonical',
				'field_value'    => 'https://danialtaherifar.ir/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
				'expected_value' => 'https://danialtaherifar.ir/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
				'message'        => 'Test with an encoded url given.',
			],
			[
				'field_name'     => 'meta-robots-noindex',
				'field_value'    => '0',
				'expected_value' => '0',
				'message'        => 'Test dropdown with a known option value.',
			],
			[
				'field_name'     => 'meta-robots-noindex',
				'field_value'    => '100',
				'expected_value' => '0',
				'message'        => 'Test dropdown with an unknown option value.',
			],
			[
				'field_name'     => 'meta-robots-nofollow',
				'field_value'    => '1',
				'expected_value' => '1',
				'message'        => 'Test radio button with a known option value.',
			],
			[
				'field_name'     => 'meta-robots-nofollow',
				'field_value'    => '2',
				'expected_value' => '0',
				'message'        => 'Test radio button with an unknown option value.',
			],
			[
				'field_name'     => 'title',
				'field_value'    => 'Title',
				'expected_value' => 'Title',
				'message'        => 'Test text field with string value given.',
			],
			[
				'field_name'     => 'title',
				'field_value'    => '<strong>Title</strong>',
				'expected_value' => 'Title',
				'message'        => 'Test text field with html given.',
			],
			[
				'field_name'     => 'meta-robots-adv',
				'field_value'    => [ 'noimageindex', 'nosnippet' ],
				'expected_value' => 'noimageindex,nosnippet',
				'message'        => 'Test multiselect field with valid values given.',
			],
			[
				'field_name'     => 'meta-robots-adv',
				'field_value'    => [ '<strong>noimageindex</strong>', 'dingdong' ],
				'expected_value' => 'noimageindex',
				'message'        => 'Test multiselect field with invalid values given.',
			],
			[
				'field_name'     => 'schema_page_type',
				'field_value'    => 'AboutPage',
				'expected_value' => 'AboutPage',
				'message'        => 'Test schema page type with valid value.',
			],
			[
				'field_name'     => 'schema_article_type',
				'field_value'    => 'SatiricalArticle',
				'expected_value' => 'SatiricalArticle',
				'message'        => 'Test schema article type with valid value.',
			],
			[
				'field_name'     => 'schema_page_type',
				'field_value'    => '',
				'expected_value' => '',
				'message'        => 'Test schema page type with the default value.',
			],
			[
				'field_name'     => 'schema_article_type',
				'field_value'    => '',
				'expected_value' => '',
				'message'        => 'Test schema article type with the default value.',
			],
			[
				'field_name'     => 'schema_page_type',
				'field_value'    => 'invalid-page-type',
				'expected_value' => '',
				'message'        => 'Test schema page type with invalid value.',
			],
			[
				'field_name'     => 'schema_article_type',
				'field_value'    => 'invalid-article-type',
				'expected_value' => '',
				'message'        => 'Test schema article type with invalid value.',
			],
		];
	}
}
