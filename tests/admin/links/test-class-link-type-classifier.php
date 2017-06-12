<?php

class WPSEO_Link_Type_Classifier_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Link_Type_Classifier */
	protected $classifier;

	/**
	 * Sets the classifier object to use.
	 */
	public function setUp() {
		parent::setUp();

		$this->classifier = new WPSEO_Link_Type_Classifier( 'http://example.com' );
	}

	/**
	 * Test with an internal link.
	 */
	public function test_internal_link() {
		$this->assertEquals( 'internal', $this->classifier->classify( 'http://example.com/page' ) );
	}

	/**
	 * Test with an external link
	 */
	public function test_outbound_link() {
		$this->assertEquals( 'outbound', $this->classifier->classify( 'http://test.com/page' ) );
	}

	/**
	 * Test with an internal link.
	 */
	public function test_with_protocolless_link() {
		$this->assertEquals( 'internal', $this->classifier->classify( 'page' ) );
	}
}


