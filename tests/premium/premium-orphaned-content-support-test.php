<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Premium_Orphaned_Content_Support_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Premium_Orphaned_Content_Support
	 */
	protected $class_instance;

	/**
	 * Sets the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Premium_Orphaned_Content_Support();
	}

	/**
	 * Tests the default situation where a hook isn't set.
	 *
	 * @covers WPSEO_Premium_Orphaned_Content_Support::get_supported_post_types()
	 */
	public function test_get_supported_post_types_without_hook() {
		$this->assertEquals(
			array(
				'page'       => 'page',
				'post'       => 'post',
				'attachment' => 'attachment',
			),
			$this->class_instance->get_supported_post_types()
		);
	}

	/**
	 * Tests the situation where the attachment post type has been filtered.
	 *
	 * @covers WPSEO_Premium_Orphaned_Content_Support::get_supported_post_types()
	 */
	public function test_get_supported_post_types_with_hook() {
		add_filter( 'wpseo_orphaned_post_types', array( 'WPSEO_Post_Type', 'filter_attachment_post_type' ) );

		$this->assertEquals(
			array(
				'page' => 'page',
				'post' => 'post',
			),
			$this->class_instance->get_supported_post_types()
		);

		remove_filter( 'wpseo_orphaned_post_types', array( 'WPSEO_Post_Type', 'filter_attachment_post_type' ) );
	}

	/**
	 * Tests the situation where a hook returns a non array value.
	 *
	 * @covers WPSEO_Premium_Orphaned_Content_Support::get_supported_post_types()
	 */
	public function test_get_supported_post_types_with_hook_that_returns_bool() {
		add_filter( 'wpseo_orphaned_post_types', '__return_false' );

		$this->assertEquals(
			array(),
			$this->class_instance->get_supported_post_types()
		);

		remove_filter( 'wpseo_orphaned_post_types', '__return_false' );
	}

	/**
	 * Tests the default situation where the attachment post type is supported.
	 *
	 * @covers WPSEO_Premium_Orphaned_Content_Support::is_post_type_supported()
	 */
	public function test_attachment_post_type_is_supported_attachment_without_hook() {
		$this->assertTrue( $this->class_instance->is_post_type_supported( 'attachment' ) );
	}

	/**
	 * Tests the situation where the attachment post type has been filtered.
	 *
	 * @covers WPSEO_Premium_Orphaned_Content_Support::get_supported_post_types()
	 */
	public function test_attachment_post_type_is_supported_attachment_with_hook_that_filters_the_attachment() {
		add_filter( 'wpseo_orphaned_post_types', array( 'WPSEO_Post_Type', 'filter_attachment_post_type' ) );

		$this->assertFalse( $this->class_instance->is_post_type_supported( 'attachment' ) );

		remove_filter( 'wpseo_orphaned_post_types', array( 'WPSEO_Post_Type', 'filter_attachment_post_type' ) );
	}
}
