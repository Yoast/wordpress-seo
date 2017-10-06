<?php

class WPSEO_Link_Factory_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the processing of an external link.
	 */
	public function test_process_external_link() {
		$populator = $this
			->getMockBuilder( 'WPSEO_Link_Internal_Lookup' )
			->getMock();

		$populator
			->expects( $this->never() )
			->method( 'lookup' );

		$processor = new WPSEO_Link_Factory( $this->getClassifierMock( 'external' ), $populator, $this->getFilterMock( 'page', true ) );

		$this->assertEquals(
			array( new WPSEO_Link( 'test', 0,'external' ) ),
			$processor->build( array( 'test' ) )
		);
	}

	/**
	 * @dataProvider link_provider
	 *
	 * @param WPSEO_Link_Type_Classifier $classifier The classifier mock
	 * @param WPSEO_Link_Internal_Lookup $lookup     The lookup mock
	 * @param WPSEO_Link_Filter          $filter     The link filter.
	 * @param string                     $linkURL    The link url to test.
	 * @param mixed                      $expected   The expected result
	 */
	public function test_process_internal_link( $classifier, $lookup, $filter, $linkURL, $expected ) {
		$processor = new WPSEO_Link_Factory( $classifier, $lookup, $filter );
		$actual    = $processor->build( array( $linkURL ) );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Provides a couple of internal links
	 *
	 * @return array
	 */
	public function link_provider() {

		return array(
			array(
				$this->getClassifierMock( 'internal' ),
				$this->getLookUpMock( 2 ),
				$this->getFilterMock( 'currentpage', true ),
				'test',
				array( new WPSEO_Link( 'test',  2,'internal' ) ),
			),
			array(
				$this->getClassifierMock( 'internal' ),
				$this->getLookUpMock( 2 ),
				$this->getFilterMock( 'test.html', false ),
				'test.html#hastag',
				array(),
			),
			array(
				$this->getClassifierMock( 'internal' ),
				$this->getLookUpMock( 2 ),
				$this->getFilterMock( 'test.html', false ),
				'test.html?foo=bar',
				array(),
			),
		);
	}

	/**
	 *
	 */
	protected function getClassifierMock( $classifyResult ) {
		/** @var WPSEO_Link_Type_Classifier $classifier */
		$classifier = $this
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'classify' )
			->will( $this->returnValue( $classifyResult ) );

		return $classifier;
	}

	protected function getLookUpMock( $lookupResult ) {
		$lookup = $this
			->getMockBuilder( 'WPSEO_Link_Internal_Lookup' )
			->getMock();

		$lookup
			->expects( $this->once() )
			->method( 'lookup' )
			->will( $this->returnValue( $lookupResult ) );

		return $lookup;
	}

	protected function getFilterMock( $currentPage, $filterResult ) {
		$filter = $this
			->getMockBuilder( 'WPSEO_Link_Filter' )
			->setConstructorArgs( array( $currentPage ) )
			->getMock();

		$filter
			->expects( $this->once() )
			->method( 'internal_link_with_fragment_filter' )
			->will( $this->returnValue( $filterResult ) );

		return $filter;
	}

}
