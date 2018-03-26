<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Components
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console_Test
 */
class WPSEO_Config_Factory_Post_Type_Test extends PHPUnit_Framework_TestCase {

	/**
	 * @covers WPSEO_Config_Factory_Post_Type::get_fields()
	 */
	public function test_get_fields() {

		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		$post_types = WPSEO_Post_Type::filter_attachment_post_type( $post_types );

		$factory_post_type = new WPSEO_Config_Factory_Post_Type();
		$fields            = $factory_post_type->get_fields();

		$this->assertEquals( count( $fields ), count( $post_types ) );

		$post_type_list = array_keys( $post_types );

		foreach ( $fields as $field ) {
			$this->assertTrue( in_array( $field->get_post_type(), $post_type_list, true ) );
		}
	}
}
