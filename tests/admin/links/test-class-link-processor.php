<?php

/** @group test */
class WPSEO_Link_Processor_Test extends WPSEO_UnitTestCase {

	public function test_process_outbound_link(  ) {

		/** @var WPSEO_Link_Type_Classifier $stub */
		$classifier = $this
			->getMockBuilder( WPSEO_Link_Type_Classifier::class )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->method( 'classify' )
			->willReturn( 'outbound' );

		$populator = $this
			->getMockBuilder( WPSEO_Link_Populator::class )
			->getMock();
		$populator
			->method( 'populate' )
			->willReturn( 0 );

		$processor = new WPSEO_Link_Processor( $classifier, $populator );

		$this->assertEquals(
			array( new WPSEO_Link( 'test', 1, 0,'outbound'  ) ),
			$processor->process( array( 'test' ), 1 )
		);
	}

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
			->getMockBuilder( WPSEO_Link_Populator::class )
			->getMock();
		$populator
			->method( 'populate' )
			->willReturn( 2 );

		$processor = new WPSEO_Link_Processor( $classifier, $populator );

		$this->assertEquals(
			array( new WPSEO_Link( 'test', 1, 2,'internal'  ) ),
			$processor->process( array( 'test' ), 1 )
		);
	}

}