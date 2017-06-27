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
		$this->assertEquals( 'external', $this->classifier->classify( 'http://test.com/page' ) );
	}

	/**
	 * Test with an internal link.
	 */
	public function test_with_protocolless_link() {
		$this->assertEquals( 'internal', $this->classifier->classify( 'page' ) );
	}

	/**
	 * Checks the execution of contains_protocol
	 */
	public function test_contains_protocol() {
		/** @var WPSEO_Link_Type_Classifier $classifier */
		$classifier = $this
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->setConstructorArgs( array( 'http://example.com' ) )
			->setMethods( array( 'contains_protocol' ) )
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'contains_protocol' )
			->with( 'http://test.com/page' )
			->will( $this->returnValue( true ) );

		$classifier->classify( 'http://test.com/page' );
	}

	/**
	 * Checks the execution of is_external_link
	 */
	public function test_is_external_link() {
		/** @var WPSEO_Link_Type_Classifier $classifier */
		$classifier = $this
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->setConstructorArgs( array( 'http://example.com' ) )
			->setMethods( array( 'is_external_link' ) )
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'is_external_link' )
			->with( 'http://test.com/page' )
			->will( $this->returnValue( true ) );

		$classifier->classify( 'http://test.com/page' );
	}

}


