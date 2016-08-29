<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console_Mock
 */
class WPSEO_Config_Component_Connect_Google_Search_Console_Mock extends WPSEO_Config_Component_Connect_Google_Search_Console {

	/**
	 * Make function public
	 *
	 * @param array $current_data
	 * @param array $data
	 */
	public function handle_access_token_clear( $current_data, $data ) {
		return parent::handle_access_token_clear( $current_data, $data );
	}

	/**
	 * Make function public
	 *
	 * @param array $current_data
	 * @param array $data
	 */
	public function handle_profile_change( $current_data, $data ) {
		return parent::handle_profile_change( $current_data, $data );
	}

	/**
	 * Get the set service
	 *
	 * @return WPSEO_GSC_Service
	 */
	public function get_service() {
		return $this->gsc_service;
	}

	/**
	 * Get the current settings
	 *
	 * @return string
	 */
	public function get_settings() {
		return $this->gsc_settings;
	}

	/**
	 * Get mappings
	 *
	 * @return array
	 */
	public function get_mapping() {
		return $this->mapping;
	}
}

/**
 * Class WPSEO_GSC_Settings_Stub
 */
class WPSEO_GSC_Settings_Stub extends WPSEO_GSC_Settings {

	/** @var WPSEO_UnitTestCase */
	static $test;

	/**
	 * @param WPSEO_UnitTestCase $test
	 */
	public static function set_test( WPSEO_UnitTestCase $test ) {
		self::$test = $test;
	}

	/**
	 * Stub reload_issues method
	 */
	public static function reload_issues() {
		self::$test->stub_call_register( 'reload_issues' );
	}

	/**
	 * Stub clear_data method
	 *
	 * @param WPSEO_GSC_Service $service
	 */
	public static function clear_data( WPSEO_GSC_Service $service ) {
		self::$test->stub_call_register( 'clear_data' );
	}

	/**
	 * @return string
	 */
	public static function get_profile() {
		return 'c';
	}
}

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console_Test
 */
class WPSEO_Config_Component_Connect_Google_Search_Console_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Config_Component_Connect_Google_Search_Console_Mock */
	protected $component;

	protected $stub_calls = array();

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		WPSEO_GSC_Settings_Stub::set_test( $this );
		$this->component = new WPSEO_Config_Component_Connect_Google_Search_Console_Mock();
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
			'refreshToken'       => 'a',
			'accessToken'        => 'b',
			'accessTokenExpires' => 1,
			'profile'            => 'c',
		);

		update_option(
			WPSEO_Config_Component_Connect_Google_Search_Console::OPTION_ACCESS_TOKEN,
			array(
				'refresh_token' => 'a',
				'access_token'  => 'b',
				'expires'       => 1,
			)
		);

		// Stub get_profile to return 'c'.
		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );

		$result = $this->component->get_data();

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_data()
	 */
	public function test_set_data() {

		$data = array(
			'profile'            => 'profile',
			'accessToken'        => 'token_a',
			'refreshToken'       => 'token_r',
			'accessTokenExpires' => 5,
		);

		$expected = array(
			'profile'            => true,
			'accessToken'        => true,
			'refreshToken'       => true,
			'accessTokenExpires' => true,
		);

		$result = $this->component->set_data( $data );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_data()
	 */
	public function test_set_data_empty_token() {

		$data = array(
			'profile'            => '',
			'accessToken'        => '',
			'refreshToken'       => '',
			'accessTokenExpires' => 0,
		);

		$expected = array(
			'profile'            => true,
			'accessToken'        => true,
			'refreshToken'       => true,
			'accessTokenExpires' => true,
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
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_access_token_clear()
	 */
	public function test_handle_access_token_clear() {
		$current = array( 'accessToken' => 'a' );
		$new     = array( 'accessToken' => 'b' );

		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );
		$this->component->handle_access_token_clear( $current, $new );

		// The accessToken is not empty, so should not be called.
		$this->assertFalse( $this->stub_called( 'clear_data' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_access_token_clear()
	 */
	public function test_handle_access_token_clear_no_changes() {
		$current = array( 'accessToken' => 'a' );
		$new     = array( 'accessToken' => 'a' );

		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );
		$this->component->handle_access_token_clear( $current, $new );

		// No changes, so should not be called.
		$this->assertFalse( $this->stub_called( 'clear_data' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_access_token_clear()
	 */
	public function test_handle_access_token_clear_clear() {
		$current = array( 'accessToken' => 'a' );
		$new     = array( 'accessToken' => '' );

		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );
		$this->component->handle_access_token_clear( $current, $new );

		// The accessToken is empty but wasn't before, should be cleared.
		$this->assertTrue( $this->stub_called( 'clear_data' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_profile_change()
	 */
	public function test_handle_profile_change() {
		$current = array( 'profile' => 'a' );
		$new     = array( 'profile' => 'b' );

		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );
		$this->component->handle_profile_change( $current, $new );

		$this->assertTrue( $this->stub_called( 'reload_issues' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::handle_profile_change()
	 */
	public function test_handle_profile_change_no_changes() {
		$current = array( 'profile' => 'a' );
		$new     = $current;

		$this->component->set_gsc_settings( 'WPSEO_GSC_Settings_Stub' );
		$this->component->handle_profile_change( $current, $new );

		$this->assertFalse( $this->stub_called( 'reload_issues' ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_gsc_service()
	 */
	public function test_set_gsc_service() {
		$service = $this->getMockBuilder( WPSEO_GSC_Service::class )->getMock();

		$this->component->set_gsc_service( $service );

		$this->assertEquals( $service, $this->component->get_service() );
	}

	/**
	 * @covers WPSEO_Config_Component_Connect_Google_Search_Console::set_gsc_settings()
	 */
	public function test_set_gsc_settings() {
		$class_name = 'stdClass';
		$this->component->set_gsc_settings( $class_name );

		$this->assertEquals( $class_name, $this->component->get_settings() );
	}

	/**
	 * @expectedException InvalidArgumentException
	 * @expectedExceptionMessage Class must exist.
	 */
	public function test_set_gsc_settings_invalid_class() {
		$class_name = 'does_not_exist';
		$this->component->set_gsc_settings( $class_name );
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
