<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI\Components
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console_Test
 */
class WPSEO_Config_Component_Connect_Google_Search_Console_Test extends PHPUnit_Framework_TestCase {

	/** @var WPSEO_Config_Component_Connect_Google_Search_Console_Mock */
	protected $component;

	/** @var array List of stub calls */
	protected $stub_calls = array();

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->component = new WPSEO_Config_Component_Connect_Google_Search_Console_Mock( $this );
	}

	/**
	 * Tear down
	 */
	public function tearDown() {
		parent::tearDown();

		$this->stub_calls = array();
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::get_identifier()
	 */
	public function test_get_identifier() {
		$this->assertEquals( 'ConnectGoogleSearchConsole', $this->component->get_identifier() );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::get_field()
	 */
	public function test_get_field() {
		$this->assertEquals(
			'WPSEO_Config_Field_Connect_Google_Search_Console',
			get_class( $this->component->get_field() )
		);
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::get_data()
	 */
	public function test_get_data() {
		$expected = array(
			'profile'        => 'c',
			'profileList'    => array(),
			'hasAccessToken' => false,
		);

		$this->component->set_profile( 'c' );

		$result = $this->component->get_data();

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_data()
	 */
	public function test_set_data() {

		$data = array(
			'profile' => 'profile',
		);

		$expected = array(
			'profile' => true,
		);

		$result = $this->component->set_data( $data );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_data()
	 */
	public function test_set_data_empty_token() {

		$data = array(
			'profile' => '',
		);

		$expected = array(
			'profile' => true,
		);

		$result = $this->component->set_data( $data );

		$this->assertEquals( $expected, $result );

		$this->assertEquals(
			'default',
			get_option( WPSEO_Config_Component_Connect_Google_Search_Console::OPTION_ACCESS_TOKEN, 'default' )
		);

		$this->assertEquals(
			'default',
			get_option( WPSEO_Config_Component_Connect_Google_Search_Console::OPTION_REFRESH_TOKEN, 'default' )
		);
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_profile_change()
	 */
	public function test_handle_profile_change() {
		$current = array( 'profile' => 'a' );
		$new     = array( 'profile' => 'b' );

		$this->component->handle_profile_change( $current, $new );

		$this->assertTrue( $this->stub_called( 'reload_issues' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_profile_change()
	 */
	public function test_handle_profile_change_no_changes() {
		$current = array( 'profile' => 'a' );
		$new     = $current;

		$this->component->handle_profile_change( $current, $new );

		$this->assertFalse( $this->stub_called( 'reload_issues' ) );
	}

	/**
	 * @param string $call Function call to register.
	 */
	public function stub_call_register( $call ) {
		$this->stub_calls[] = $call;
	}

	/**
	 * @param string $call Function call to check.
	 *
	 * @return bool
	 */
	public function stub_called( $call ) {
		return in_array( $call, $this->stub_calls, true );
	}
}
