<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group upgrades
 */
class WPSEO_Upgrade_History_Test extends WPSEO_UnitTestCase {

	/**
	 * Option name.
	 *
	 * @var string
	 */
	private static $option_name = 'wpseo_history_test';

	/**
	 * Retrieves a history object.
	 *
	 * @return WPSEO_Upgrade_History
	 */
	private function get_instance() {
		return new WPSEO_Upgrade_History( self::$option_name );
	}

	/**
	 * Removes the used option.
	 */
	public function tear_down() {
		delete_option( self::$option_name );

		parent::tear_down();
	}

	/**
	 * Tests the constructor with the default option name.
	 *
	 * @covers WPSEO_Upgrade_History::__construct
	 */
	public function test_construct_with_default_option_name() {
		$instance = new WPSEO_Upgrade_History();

		$this->assertEquals( 'wpseo_upgrade_history', $this->getPropertyValue( $instance, 'option_name' ) );
	}

	/**
	 * Tests the constructor with the given option name.
	 *
	 * @covers WPSEO_Upgrade_History::__construct
	 */
	public function test_construct_with_given_option_name() {
		$instance = new WPSEO_Upgrade_History( 'my_option_name' );

		$this->assertEquals( 'my_option_name', $this->getPropertyValue( $instance, 'option_name' ) );
	}

	/**
	 * Tests whether $history is an array and is empty.
	 *
	 * @covers WPSEO_Upgrade_History::get
	 */
	public function test_get_empty() {
		$upgrade_history = $this->get_instance();
		$history         = $upgrade_history->get();

		$this->assertIsArray( $history );
		$this->assertEmpty( $history );
	}

	/**
	 * Tests whether new entries are correctly added to an array.
	 *
	 * @covers WPSEO_Upgrade_History::add
	 * @covers WPSEO_Upgrade_History::get_options_data
	 * @covers WPSEO_Upgrade_History::get
	 * @covers WPSEO_Upgrade_History::set
	 */
	public function test_add() {
		// This must contain something.
		update_option( 'mock_option_name', 'mock_data' );

		$upgrade_history = $this->get_instance();
		$upgrade_history->add( '1.0.0', '2.0.0', [ 'mock_option_name' ] );

		delete_option( 'mock_option_name' );

		$history = $upgrade_history->get();
		$entry   = current( $history );

		$this->assertArrayHasKey( 'old_version', $entry );
		$this->assertArrayHasKey( 'new_version', $entry );

		$this->assertEquals( $entry['old_version'], '1.0.0' );
		$this->assertEquals( $entry['new_version'], '2.0.0' );
	}

	/**
	 * Tests the situation where no options are added.
	 *
	 * @covers WPSEO_Upgrade_History::add
	 */
	public function test_add_no_options() {
		$upgrade_history = $this->get_instance();
		$upgrade_history->add( '1.0.0', '2.0.0', [] );

		$history = $upgrade_history->get();
		$entry   = current( $history );

		$this->assertIsArray( $entry, 'There should be an entry added.' );
		$this->assertArrayHasKey( 'options', $entry );
		$this->assertEmpty( $entry['options'], 'There should be no options.' );
		$this->assertEquals( '1.0.0', $entry['old_version'] );
		$this->assertEquals( '2.0.0', $entry['new_version'] );
	}

	/**
	 * Tests to see if an empty option does not add a new history entry.
	 *
	 * @covers WPSEO_Upgrade_History::add
	 */
	public function test_add_empty_option() {
		$upgrade_history = $this->get_instance();
		$upgrade_history->add( '1.0.0', '2.0.0', [ 'option_does_not_exist' ] );

		$history = $upgrade_history->get();
		$entry   = current( $history );

		$this->assertIsArray( $entry, 'There should be an entry added.' );
		$this->assertArrayHasKey( 'options', $entry );
		$this->assertEmpty( $entry['options'], 'The non-existing option should not be returned.' );
		$this->assertEquals( '1.0.0', $entry['old_version'] );
		$this->assertEquals( '2.0.0', $entry['new_version'] );
	}
}
