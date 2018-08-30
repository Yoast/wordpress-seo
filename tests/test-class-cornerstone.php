<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Cornerstone test
 */
class WPSEO_Cornerstone_Test extends WPSEO_UnitTestCase {

	/**
	 * Checks the registering of the hooks on the admin.php page. No hooks should be registered.
	 *
	 * @covers WPSEO_Cornerstone::register_hooks()
	 * @covers WPSEO_Cornerstone::page_contains_cornerstone_content_field()
	 */
	public function test_register_hooks_on_admin_page() {
		$cornerstone = $this
			->getMockBuilder( 'WPSEO_Cornerstone' )
			->setMethods( array( 'page_contains_cornerstone_content_field' ) )
			->getMock();

		$cornerstone
			->expects( $this->once() )
			->method( 'page_contains_cornerstone_content_field' )
			->will( $this->returnValue( false ) );

		$cornerstone->register_hooks();

		$this->assertFalse( has_action( 'save_post', array( $cornerstone, 'save_meta_value' ) ) );
	}

	/**
	 * Checks the registering of the hooks on the post-new.php page. The hooks should be registered.
	 *
	 * @covers WPSEO_Cornerstone::register_hooks()
	 * @covers WPSEO_Cornerstone::page_contains_cornerstone_content_field()
	 */
	public function test_register_hooks_on_post_new_page() {
		$cornerstone = $this
			->getMockBuilder( 'WPSEO_Cornerstone' )
			->setMethods( array( 'page_contains_cornerstone_content_field' ) )
			->getMock();

		$cornerstone
			->expects( $this->once() )
			->method( 'page_contains_cornerstone_content_field' )
			->will( $this->returnValue( true ) );

		$cornerstone->register_hooks();

		$this->assertEquals( 10, has_action( 'save_post', array( $cornerstone, 'save_meta_value' ) ) );
	}

	/**
	 * Tests the saving of a meta value when 'cornerstone' checkbox is not checked.
	 *
	 * We expect the delete_meta method to be called.
	 *
	 * @covers WPSEO_Cornerstone::save_meta_value()
	 */
	public function test_save_meta_value_when_no_value_posted() {
		$post = $this->factory->post->create_and_get();

		$cornerstone = $this
			->getMockBuilder( 'WPSEO_Cornerstone' )
			->setMethods( array( 'is_cornerstone_content', 'delete_meta' ) )
			->getMock();

		$cornerstone
			->expects( $this->once() )
			->method( 'is_cornerstone_content' )
			->will( $this->returnValue( false ) );

		$cornerstone
			->expects( $this->once() )
			->method( 'delete_meta' )
			->with( $post->ID );

		$cornerstone->save_meta_value( $post->ID );
	}

	/**
	 * Tests the saving of a meta value when 'cornerstone' checkbox is checked.
	 *
	 * We expect the update_meta method to be called.
	 *
	 * @covers WPSEO_Cornerstone::save_meta_value()
	 */
	public function test_save_meta_value_when_value_posted() {
		$post = $this->factory->post->create_and_get();

		$cornerstone = $this
			->getMockBuilder( 'WPSEO_Cornerstone' )
			->setMethods( array( 'is_cornerstone_content', 'update_meta' ) )
			->getMock();

		$cornerstone
			->expects( $this->once() )
			->method( 'is_cornerstone_content' )
			->will( $this->returnValue( true ) );

		$cornerstone
			->expects( $this->once() )
			->method( 'update_meta' )
			->with( $post->ID, true );

		$cornerstone->save_meta_value( $post->ID );
	}
}
