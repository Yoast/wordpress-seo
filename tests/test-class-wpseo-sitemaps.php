<?php

class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	private $wp_actions;

	private $wp_filter;

	public function setUp() {
		global $wp_filter, $wp_actions;

		parent::setUp();

		$this->factory->post->create_many( 5 );

		$this->wp_filter = $wp_filter;
		$this->wp_actions = $wp_actions;
	}

	// dummy test to prevent warning
	public function test_true_is_true() {
		$this->assertTrue( true );
	}

}