<?php

class WPSEO_Link_Factory_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the processing of an external link.
	 */
	public function test_process_external_link(  ) {

		/** @var WPSEO_Link_Type_Classifier $stub */
		$classifier = $this
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'classify' )
			->will( $this->returnValue( 'external' ) );

		$populator = $this
			->getMockBuilder( 'WPSEO_Link_Internal_Lookup' )
			->getMock();

		$populator
			->expects( $this->never() )
			->method( 'lookup' )
			->will( $this->returnValue( 0 ) );

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
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'classify' )
			->will( $this->returnValue( 'internal' ) );

		$populator = $this
			->getMockBuilder( 'WPSEO_Link_Internal_Lookup' )
			->getMock();
		$populator
			->expects( $this->once() )
			->method( 'lookup' )
			->will( $this->returnValue( 2 ) );

		$processor = new WPSEO_Link_Factory( $classifier, $populator );

		$this->assertEquals(
			array( new WPSEO_Link( 'test',  2,'internal'  ) ),
			$processor->build( array( 'test' ) )
		);
	}

}