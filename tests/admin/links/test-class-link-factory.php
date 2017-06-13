<?php

class WPSEO_Link_Factory_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the processing of an external link.
	 */
	public function test_process_external_link(  ) {

		/** @var WPSEO_Link_Type_Classifier $stub */
		$classifier = $this
			->getMockBuilder( WPSEO_Link_Type_Classifier::class )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->method( 'classify' )
			->willReturn( 'external' );

		$populator = $this
			->getMockBuilder( WPSEO_Link_Internal_Lookup::class )
			->getMock();
		$populator
			->method( 'lookup' )
			->willReturn( 0 );

		$processor = new WPSEO_Link_Factory( $classifier, $populator );

		$this->assertEquals(
			array( new WPSEO_Link( 'test', 0,'external'  ) ),
			$processor->build( array( 'test' ) )
		);
	}

	/**
	 * Tests the processing of an internal link.
	 */
	public function test_process_internal_link(  ) {

		/** @var WPSEO_Link_Type_Classifier $stub */
		$classifier = $this
			->getMockBuilder( WPSEO_Link_Type_Classifier::class )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->method( 'classify' )
			->willReturn( 'internal' );

		$populator = $this
			->getMockBuilder( WPSEO_Link_Internal_Lookup::class )
			->getMock();
		$populator
			->method( 'lookup' )
			->willReturn( 2 );

		$processor = new WPSEO_Link_Factory( $classifier, $populator );

		$this->assertEquals(
			array( new WPSEO_Link( 'test',  2,'internal'  ) ),
			$processor->build( array( 'test' ) )
		);
	}

}