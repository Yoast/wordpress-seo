<?php

class WPSEO_Register_Capabilities_Tests extends PHPUnit_Framework_TestCase {
	public function test_register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$register = new WPSEO_Register_Capabilities();
		$register->register();

		$registered = $manager->get_capabilities();

		$this->assertContains( 'wpseo_bulk_edit', $registered );
		$this->assertContains( 'wpseo_manage_options', $registered );
	}
}
