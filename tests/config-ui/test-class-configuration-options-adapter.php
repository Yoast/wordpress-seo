<?php
/**
 * @package WPSEO\Tests\ConfigUI
 */

/**
 * Class WPSEO_Configuration_Options_Adapter_Test
 */
class WPSEO_Configuration_Options_Adapter_Test extends PHPUnit_Framework_TestCase {

	/** @var WPSEO_Configuration_Options_Adapter_Mock */
	protected $adapter;

	/**
	 * Include helper class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/wpseo-configuration-options-adapter-mock.php';
	}

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->adapter = new WPSEO_Configuration_Options_Adapter_Mock();
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::add_lookup()
	 */
	public function test_add_lookup() {
		$class_name = 'c';
		$type       = 't';
		$option     = 'o';

		$expected = array(
			$class_name => array(
				'type'   => $type,
				'option' => $option,
			),
		);

		$this->assertNull( $this->adapter->add_lookup( $class_name, $type, $option ) );
		$this->assertEquals( $expected, $this->adapter->get_lookups() );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::add_custom_lookup()
	 */
	public function test_add_custom_lookup() {
		$class_name   = 'stdClass';
		$callback_set = '__return_true';
		$callback_get = '__return_false';

		$expected = array(
			$class_name => array(
				'type'   => WPSEO_Configuration_Options_Adapter::OPTION_TYPE_CUSTOM,
				'option' => array(
					$callback_set,
					$callback_get,
				),
			),
		);

		$this->assertNull( $this->adapter->add_custom_lookup( $class_name, $callback_set, $callback_get ) );
		$this->assertEquals( $expected, $this->adapter->get_lookups() );
	}

	/**
	 * @covers                   WPSEO_Configuration_Options_Adapter::add_custom_lookup()
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage Custom option must be callable.
	 */
	public function test_add_custom_lookup_not_a_callback_get() {
		$this->adapter->add_custom_lookup( 'stdClass', 'not_callable', '__return_true' );
	}

	/**
	 * @covers                   WPSEO_Configuration_Options_Adapter::add_custom_lookup()
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage Custom option must be callable.
	 */
	public function test_add_custom_lookup_not_a_callback_set() {
		$this->adapter->add_custom_lookup( 'stdClass', '__return_true', 'not_callable' );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::add_yoast_lookup()
	 */
	public function test_add_yoast_lookup() {
		$class_name = 'stdClass';
		$group      = 'wpseo';
		$key        = 'title';

		$expected = array(
			$class_name => array(
				'type'   => WPSEO_Configuration_Options_Adapter::OPTION_TYPE_YOAST,
				'option' => array(
					$group,
					$key,
				),
			),
		);

		$this->assertNull( $this->adapter->add_yoast_lookup( $class_name, $group, $key ) );
		$this->assertEquals( $expected, $this->adapter->get_lookups() );
	}

	/**
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage Yoast option non_existing_option not found.
	 */
	public function test_add_yoast_lookup_invalid_option() {
		$this->adapter->add_yoast_lookup( 'stdClass', 'non_existing_option', '' );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::add_wordpress_lookup()
	 */
	public function test_add_wordpress_lookup() {
		$class_name = 'stdClass';
		$option     = 'blogname';

		$expected = array(
			$class_name => array(
				'type'   => WPSEO_Configuration_Options_Adapter::OPTION_TYPE_WORDPRESS,
				'option' => $option,
			),
		);

		$this->assertNull( $this->adapter->add_wordpress_lookup( $class_name, $option ) );
		$this->assertEquals( $expected, $this->adapter->get_lookups() );
	}

	/**
	 * @covers                   WPSEO_Configuration_Options_Adapter::add_wordpress_lookup()
	 *
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage WordPress option must be a string.
	 */
	public function test_add_wordpress_lookup_option_non_string() {
		$this->adapter->add_wordpress_lookup( 'stdClass', array() );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get_option_type()
	 */
	public function test_get_option_type() {
		$class_name = 'stdClass';
		$type       = 'type';

		$this->assertNull( $this->adapter->get_option_type( 'not_set' ) );

		$this->adapter->add_lookup( $class_name, $type, 'option' );
		$this->assertEquals( $type, $this->adapter->get_option_type( $class_name ) );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get_option()
	 */
	public function test_get_option() {
		$class_name = 'stdClass';
		$option     = 'option';

		$this->assertNull( $this->adapter->get_option( 'not_set' ) );

		$this->adapter->add_lookup( $class_name, 'type', $option );
		$this->assertEquals( $option, $this->adapter->get_option( $class_name ) );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get()
	 */
	public function test_get_wordpress_option() {
		$option   = 'blogname';
		$expected = get_option( $option );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_wordpress_lookup( $field->get_identifier(), $option );

		$result = $this->adapter->get( $field );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get()
	 */
	public function test_get_yoast_option() {
		$option = 'wpseo';
		$key    = 'version';

		$wpseo    = WPSEO_Options::get_option( $option );
		$expected = $wpseo[ $key ];

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_yoast_lookup( $field->get_identifier(), $option, $key );

		$result = $this->adapter->get( $field );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get()
	 */
	public function test_get_custom_option() {
		$get = array( $this, 'custom_option_get' );

		$expected = call_user_func( $get );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_custom_lookup( $field->get_identifier(), $get, '__return_true' );

		$result = $this->adapter->get( $field );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::get()
	 */
	public function test_get_unknown_type() {

		$field_name = 'field';

		$class = $this
			->getMockBuilder( 'WPSEO_Config_Field' )
			->setConstructorArgs( array( $field_name, 'component' ) )
			->getMock();

		$this->adapter->add_lookup( $field_name, 'some_type', 'some_option' );
		$this->assertEquals( null, $this->adapter->get( $class, 'value' ) );

	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::set()
	 */
	public function test_set_wordpress_option() {
		$option = uniqid( 'ut' );
		$value  = uniqid( 'v' );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_wordpress_lookup( $field->get_identifier(), $option );

		$this->assertTrue( $this->adapter->set( $field, $value ) );
		$this->assertEquals( $value, get_option( $option ) );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::set()
	 */
	public function test_set_yoast_option() {
		$option = 'wpseo';
		$key    = 'company_name';

		$wpseo         = WPSEO_Options::get_option( $option );
		$wpseo[ $key ] = uniqid( 'u' );
		update_option( $option, $wpseo );

		$value = uniqid( 'v' );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_yoast_lookup( $field->get_identifier(), $option, $key );

		$this->assertEquals( true, $this->adapter->set( $field, $value ) );

		$wpseo = WPSEO_Options::get_option( $option );
		$this->assertEquals( $value, $wpseo[ $key ] );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::set()
	 */
	public function test_set_yoast_option_same_value() {
		$option = 'wpseo';
		$key    = 'company_name';
		$value  = uniqid( 'v' );

		$wpseo         = WPSEO_Options::get_option( $option );
		$wpseo[ $key ] = $value;
		update_option( $option, $wpseo );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_yoast_lookup( $field->get_identifier(), $option, $key );

		$this->assertEquals( true, $this->adapter->set( $field, $value ) );

		$wpseo = WPSEO_Options::get_option( $option );
		$this->assertEquals( $value, $wpseo[ $key ] );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::set()
	 */
	public function test_set_option_unknown_type() {
		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_lookup( $field->get_identifier(), 'some_type', 'some_option' );
		$this->assertEquals( false, $this->adapter->set( $field, 'value' ) );
	}

	/**
	 * @covers WPSEO_Configuration_Options_Adapter::set()
	 */
	public function test_set_custom_option() {
		$catcher = $this
			->getMockBuilder( 'stdClass' )
			->setMethods( array( 'set' ) )
			->getMock();

		$catcher
			->expects( $this->once() )
			->method( 'set' )
			->will( $this->returnValue( true ) );

		$field = new WPSEO_Config_Field( 'field', 'component' );

		$this->adapter->add_custom_lookup( $field->get_identifier(), '__return_true', array(
			$catcher,
			'set',
		) );

		$this->assertTrue( $this->adapter->set( $field, 'value' ) );
	}

	/**
	 * @return string
	 */
	public function custom_option_get() {
		return 'custom_option_get';
	}
}
