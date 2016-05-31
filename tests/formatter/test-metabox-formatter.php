<?php
/**
 * @package WPSEO\Unittests\Formatter
 */

class WPSEO_Metabox_Formatter_Test extends WPSEO_UnitTestCase {

	/**
	 * Test with getting the values
	 *
	 * @covers WPSEO_Metabox_Formatter::__construct
	 * @covers WPSEO_Metabox_Formatter::get_values
	 * @covers WPSEO_Metabox_Formatter::get_defaults
	 * @covers WPSEO_Metabox_Formatter::get_translations
	 */
	public function test_getting_the_values() {
		$class_instance = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter(
				$this->factory->post->create_and_get(),
				array(),
				''
			)
		);
		$result = $class_instance->get_values();

		$this->assertEquals( 'Content', $result['contentTab'] );
		$this->assertTrue( array_key_exists( 'locale' , $result ) );
		$this->assertTrue( array_key_exists( 'translations' , $result ) );
		$this->assertTrue( is_array( $result['translations'] ) );
	}

	/**
	 * Test with getting the values from the language file, because we hadn't one in our test.
	 *
	 * @covers WPSEO_Metabox_Formatter::__construct
	 * @covers WPSEO_Metabox_Formatter::get_values
	 * @covers WPSEO_Metabox_Formatter::get_defaults
	 * @covers WPSEO_Metabox_Formatter::get_translations
	 */
	public function test_with_fake_language_file() {
		$file_name = plugin_dir_path( WPSEO_FILE ) . 'languages/wordpress-seo-' . get_locale() . '.json';
		file_put_contents(
			$file_name,
			json_encode( array( 'key' => 'value' ) )
		);

		$class_instance = new WPSEO_Metabox_Formatter(
			new WPSEO_Post_Metabox_Formatter(
				$this->factory->post->create_and_get(),
				array(),
				''
			)
		);
		$result = $class_instance->get_values();

		$this->assertTrue( array_key_exists( 'translations' , $result ) );
		$this->assertTrue( is_array( $result['translations'] ) );
		$this->assertEquals( $result['translations'], array( 'key' => 'value' ) );

		unlink( $file_name );

		$result = $class_instance->get_values();

		$this->assertEquals( $result['translations'], array() );

	}

}
