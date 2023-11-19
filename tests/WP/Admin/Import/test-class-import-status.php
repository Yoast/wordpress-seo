<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import
 */

/**
 * Tests for our import status object.
 */
class WPSEO_Import_Status_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether we can set a status message for the detect action.
	 *
	 * @covers WPSEO_Import_Status::__construct
	 * @covers WPSEO_Import_Status::get_action
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_detect_message() {
		$import = new WPSEO_Import_Status( 'detect', false, 'test message' );
		$this->assertEquals( false, $import->status );
		$this->assertEquals( 'detect', $import->get_action() );
		$this->assertEquals( 'test message', $import->get_msg() );
	}

	/**
	 * Tests whether we can set a status message for the import action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_action
	 */
	public function test_import_message() {
		$import = new WPSEO_Import_Status( 'import', true, 'test message' );
		$this->assertEquals( true, $import->status );
		$this->assertEquals( 'import', $import->get_action() );
		$this->assertEquals( 'test message', $import->get_msg() );
	}

	/**
	 * Tests whether we can set a status message for the cleanup action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_action
	 */
	public function test_cleanup_message() {
		$import = new WPSEO_Import_Status( 'cleanup', false, 'test message' );
		$this->assertEquals( 'cleanup', $import->get_action() );
		$this->assertEquals( 'test message', $import->get_msg() );
	}

	/**
	 * Tests whether we can set an action.
	 *
	 * @covers WPSEO_Import_Status::set_action
	 * @covers WPSEO_Import_Status::get_action
	 */
	public function test_set_action() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$import->set_action( 'detect' );
		$this->assertEquals( 'detect', $import->get_action() );
		$this->assertEquals( false, $import->status );
	}

	/**
	 * Tests whether we can set a message.
	 *
	 * @covers WPSEO_Import_Status::set_msg
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_set_msg() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$import->set_msg( 'set test message' );
		$this->assertEquals( 'set test message', $import->get_msg() );
	}

	/**
	 * Tests whether we can set a status.
	 *
	 * @covers WPSEO_Import_Status::set_status
	 */
	public function test_set_status() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$import->set_status( true );
		$this->assertEquals( true, $import->status );
	}

	/**
	 * Tests whether we can get a default message for a successful import action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_default_success_message
	 */
	public function test_default_import_message_true() {
		$import = new WPSEO_Import_Status( 'import', true );
		$this->assertEquals( '%s data successfully imported.', $import->get_msg() );
	}

	/**
	 * Tests whether we can get a default message for a faulty import action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_default_import_message_false() {
		$import = new WPSEO_Import_Status( 'import', false );
		$this->assertEquals( '%s data not found.', $import->get_msg() );
	}

	/**
	 * Tests whether we can get a default message for a successful detect action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_default_success_message
	 */
	public function test_default_detect_message_true() {
		$import = new WPSEO_Import_Status( 'detect', true );
		$this->assertEquals( '%s data found.', $import->get_msg() );
	}

	/**
	 * Tests whether we can get a default message for a faulty detect action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_default_detect_message_false() {
		$import = new WPSEO_Import_Status( 'detect', false );
		$this->assertEquals( '%s data not found.', $import->get_msg() );
	}

	/**
	 * Tests whether we can get a default message for a successful cleanup action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_default_success_message
	 */
	public function test_default_cleanup_message_true() {
		$import = new WPSEO_Import_Status( 'cleanup', true );
		$this->assertEquals( '%s data successfully removed.', $import->get_msg() );
	}

	/**
	 * Tests whether we can get a default message for a faulty cleanup action.
	 *
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_default_cleanup_message_false() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$this->assertEquals( '%s data not found.', $import->get_msg() );
	}
}
