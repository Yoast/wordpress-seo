<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Config_Component_Post_Type_Visibility_Mock
 */
class WPSEO_Config_Component_Post_Type_Visibility_Mock extends WPSEO_Config_Component_Post_Type_Visibility {
	/**
	 * Make function public
	 *
	 * @param bool   $value
	 * @param string $post_type
	 */
	public function get_option_value( & $value, $post_type ) {
		parent::get_option_value( $value, $post_type );
	}

	/**
	 * Helper to set the option
	 *
	 * @param $option
	 */
	public function set_option( $option ) {
		$this->option = $option;
	}
}

/**
 * Class WPSEO_Config_Component_Post_Type_Visibility_Test
 */
class WPSEO_Config_Component_Post_Type_Visibility_Test extends PHPUnit_Framework_TestCase {

	/** @var WPSEO_Config_Component_Post_Type_Visibility_Mock */
	protected $component;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->component = new WPSEO_Config_Component_Post_Type_Visibility_Mock();
	}

	/**
	 * @covers WPSEO_Config_Component_Post_Type_Visibility_Mock::get_identifier()
	 */
	public function test_get_identifier() {
		$this->assertEquals( 'PostTypeVisibility', $this->component->get_identifier() );
	}

	/**
	 * @covers WPSEO_Config_Component_Post_Type_Visibility_Mock::get_field()
	 */
	public function test_get_field() {
		$this->assertEquals( 'WPSEO_Config_Field_Post_Type_Visibility', get_class( $this->component->get_field() ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Post_Type_Visibility_Mock::get_data()
	 */
	public function test_get_data() {
		$post_types = get_post_types( array( 'public' => true ), 'names' );
		foreach ( $post_types as $key => $value ) {
			$post_types[ $key ] = ( $key !== 'attachment' );
		}

		$this->assertEquals( $post_types, $this->component->get_data() );
	}

	/**
	 * @covers WPSEO_Config_Component_Post_Type_Visibility::get_option_value()
	 */
	public function test_get_option_value() {

		$option = array(
			'post_types-page-not_in_sitemap' => false,
			'post_types-post-not_in_sitemap' => true,
		);

		$this->component->set_option( $option );

		$value = 'page';
		$this->component->get_option_value( $value, 'page' );

		$this->assertTrue( $value );

		$value = 'post';
		$this->component->get_option_value( $value, 'post' );

		$this->assertFalse( $value );
	}

	/**
	 * @covers WPSEO_Config_Component_Post_Type_Visibility::set_data()
	 */
	public function test_set_data() {
		$data = array(
			'post'       => false,
			'page'       => false,
		);

		$expected = array(
			'post'        => true,
			'page'        => true,
		);

		$result = $this->component->set_data( $data );

		$this->assertEquals( $expected, $result );
	}
}