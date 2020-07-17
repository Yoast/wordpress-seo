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
class WPSEO_Upgrade_Test extends WPSEO_UnitTestCase {

	/**
	 * Retrieves the instance to test against.
	 *
	 * @return WPSEO_Upgrade_Double
	 */
	protected function get_instance() {
		return new WPSEO_Upgrade_Double();
	}

	/**
	 * Tests if the option is fetched from the database.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 */
	public function test_get_option_from_database() {

		$content = [
			'a' => 'b',
			'c' => true,
			3   => new StdClass(),
		];

		$instance = $this->get_instance();

		update_option( 'some_option', $content );

		$this->assertEquals( $content, $instance->get_option_from_database( 'some_option' ) );
	}

	/**
	 * Tests that option filters are not applied on option retrieval.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 */
	public function test_get_option_from_database_no_filters_applied() {
		// Tests if the option is fetched from the database.
		$content = [
			'a' => 'b',
			'c' => true,
			3   => new StdClass(),
		];

		$instance = $this->get_instance();

		update_option( 'some_option', $content );

		add_filter( 'pre_option_some_option', [ $this, 'return_override' ] );

		$this->assertEquals( $this->return_override(), get_option( 'some_option' ) );
		$this->assertEquals( $content, $instance->get_option_from_database( 'some_option' ) );

		remove_filter( 'pre_option_some_option', [ $this, 'return_override' ] );
	}

	/**
	 * Tests to make sure non-existing option returns an empty array.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 */
	public function test_get_option_from_database_non_existent() {
		$instance = $this->get_instance();
		$this->assertEquals( [], $instance->get_option_from_database( 'non_existent_option' ) );
	}

	/**
	 * Tests to make sure invalid keys are removed upon cleanup.
	 *
	 * @covers WPSEO_Upgrade::cleanup_option_data
	 */
	public function test_cleanup_option_data() {
		// Testing the sanitization of the options framework.
		$instance = $this->get_instance();

		$original = [
			'invalid_key' => true,
			'version'     => WPSEO_VERSION,
		];

		// Set option with invalid keys in the database.
		$this->set_option_in_database( 'wpseo', $original );

		// The key should be present on the option.
		$this->assertArrayHasKey( 'invalid_key', get_option( 'wpseo' ) );

		// Cleaning up the option.
		$instance->cleanup_option_data( 'wpseo' );

		// Make sure the key has been removed.
		$this->assertArrayNotHasKey( 'invalid_key', get_option( 'wpseo' ) );
	}

	/**
	 * Tests to make sure non-existing options are not saved.
	 *
	 * @covers WPSEO_Upgrade::cleanup_option_data
	 */
	public function test_cleanup_option_data_no_data() {
		$instance = $this->get_instance();

		$instance->cleanup_option_data( 'random_option' );

		$this->assertNull( get_option( 'random_option', null ) );
	}

	/**
	 * Tests to make sure a valid setting is being saved.
	 *
	 * @covers WPSEO_Upgrade::save_option_setting
	 */
	public function test_save_option_setting() {
		// Only set the new data if found on the source.
		$source = [
			'company_name' => 'value1',
		];

		$instance = $this->get_instance();

		$previous = WPSEO_Options::get( 'company_name' );

		// Save the option.
		$instance->save_option_setting( $source, 'company_name' );

		$this->assertNotEquals( $previous, WPSEO_Options::get( 'company_name' ) );
		$this->assertEquals( $source['company_name'], WPSEO_Options::get( 'company_name' ) );
	}

	/**
	 * Tests to make sure an option is not saved if the source misses the needed key.
	 *
	 * @covers WPSEO_Upgrade::save_option_setting
	 */
	public function test_save_option_setting_not_set() {
		// Only set the new data if found on the source.
		$source = [
			'key1' => 'value1',
		];

		$instance = $this->get_instance();

		$expected = WPSEO_Options::get( 'version' );

		$instance->save_option_setting( $source, 'version' );

		$this->assertEquals( $expected, WPSEO_Options::get( 'version' ) );
	}

	/**
	 * Tests to make sure triggers are being called in the finish up method.
	 *
	 * @covers WPSEO_Upgrade::finish_up
	 */
	public function test_finish_up() {
		$instance = $this->get_instance();

		delete_option( 'wpseo' );
		delete_option( 'wpseo_titles' );
		delete_option( 'wpseo_social' );

		$instance->finish_up();

		$this->assertEquals( WPSEO_VERSION, WPSEO_Options::get( 'version' ) );
		$this->assertTrue( has_action( 'shutdown', 'flush_rewrite_rules' ) > 0 );

		// Ensure options exist.
		$this->assertNotEmpty( get_option( 'wpseo' ) );
		$this->assertNotEmpty( get_option( 'wpseo_titles' ) );
		$this->assertNotEmpty( get_option( 'wpseo_social' ) );
	}

	/**
	 * Provides a filter return value.
	 *
	 * @return string Return value.
	 */
	public function return_override() {
		return 'override';
	}

	/**
	 * Sets an option directly to the database, avoiding the Options framework.
	 *
	 * @param string $option_name  Option to save.
	 * @param mixed  $option_value Option data to save.
	 *
	 * @return void
	 */
	private function set_option_in_database( $option_name, $option_value ) {
		global $wpdb;

		$wpdb->update(
			$wpdb->options,
			[
				'option_name'  => $option_name,
				// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Reason: There's no security risk, because users don't interact with tests.
				'option_value' => serialize( $option_value ),
			],
			[ 'option_name' => $option_name ]
		);
	}
}
