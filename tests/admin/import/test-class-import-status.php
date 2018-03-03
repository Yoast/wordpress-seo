<?php
/**
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 */
class WPSEO_Import_Status_Test extends WPSEO_UnitTestCase {

	/**
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
	 * @covers WPSEO_Import_Status::get_msg
	 * @covers WPSEO_Import_Status::get_action
	 */
	public function test_cleanup_message() {
		$import = new WPSEO_Import_Status( 'cleanup', false, 'test message' );
		$this->assertEquals( 'cleanup', $import->get_action() );
		$this->assertEquals( 'test message', $import->get_msg() );
	}

	/**
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
	 * @covers WPSEO_Import_Status::set_msg
	 * @covers WPSEO_Import_Status::get_msg
	 */
	public function test_set_msg() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$import->set_msg( 'set test message' );
		$this->assertEquals( 'set test message', $import->get_msg() );
	}

	/**
	 * @covers WPSEO_Import_Status::set_status
	 */
	public function test_set_status() {
		$import = new WPSEO_Import_Status( 'cleanup', false );
		$import->set_status( true );
		$this->assertEquals( true, $import->status );
	}
}
