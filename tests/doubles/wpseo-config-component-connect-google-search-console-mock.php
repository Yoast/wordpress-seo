<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console_Mock
 */
class WPSEO_Config_Component_Connect_Google_Search_Console_Mock extends WPSEO_Config_Component_Connect_Google_Search_Console {
	/** @var string */
	protected $profile;

	/** @var WPSEO_UnitTestCase */
	protected $test;

	/**
	 * WPSEO_Config_Component_Connect_Google_Search_Console_Mock constructor.
	 *
	 * @param \WPSEO_Config_Component_Connect_Google_Search_Console_Test $test Test object.
	 */
	public function __construct( $test ) {
		$this->test = $test;

		parent::__construct();
	}

	/**
	 * Make function public
	 *
	 * @param array $current_data Saved data before changes.
	 * @param array $data         Data after changes.
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

	/**
	 * Get a mocked profile.
	 *
	 * @return string
	 */
	public function get_profile() {
		return $this->profile;
	}

	public function set_profile( $profile ) {
		$this->profile = $profile;
	}

	/**
	 * Mock reloading the GSC issues.
	 */
	public function reload_issues() {
		$this->test->stub_call_register( 'reload_issues' );
	}

	public function clear_gsc_data() {
		$this->test->stub_call_register( 'clear_data' );
	}
}
