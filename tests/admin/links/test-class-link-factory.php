<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
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
			array( new WPSEO_Link( 'test', 0, 'external' ) ),
			$processor->build( array( 'test' ) )
		);
	}

	/**
	 * @dataProvider link_provider
	 *
	 * @param WPSEO_Link_Type_Classifier $classifier The classifier mock.
	 * @param WPSEO_Link_Internal_Lookup $lookup     The lookup mock.
	 * @param WPSEO_Link_Filter          $filter     The link filter.
	 * @param string                     $link_url   The link url to test.
	 * @param mixed                      $expected   The expected result.
	 */
	public function test_process_internal_link( $classifier, $lookup, $filter, $link_url, $expected ) {
		$processor = new WPSEO_Link_Factory( $classifier, $lookup, $filter );
		$actual    = $processor->build( array( $link_url ) );

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
				array( new WPSEO_Link( 'test', 2, 'internal' ) ),
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
	 * Test helper: mock link type classifier.
	 *
	 * @param string $classify_result Outbound or internal.
	 */
	protected function getClassifierMock( $classify_result ) {
		/** @var WPSEO_Link_Type_Classifier $classifier */
		$classifier = $this
			->getMockBuilder( 'WPSEO_Link_Type_Classifier' )
			->disableOriginalConstructor()
			->getMock();

		$classifier
			->expects( $this->once() )
			->method( 'classify' )
			->will( $this->returnValue( $classify_result ) );

		return $classifier;
	}

	/**
	 * Test helper: mock internal link lookup.
	 *
	 * @param int $lookup_result The post id belongs to given link if link is internal.
	 */
	protected function getLookUpMock( $lookup_result ) {
		$lookup = $this
			->getMockBuilder( 'WPSEO_Link_Internal_Lookup' )
			->getMock();

		$lookup
			->expects( $this->once() )
			->method( 'lookup' )
			->will( $this->returnValue( $lookup_result ) );

		return $lookup;
	}

	/**
	 * Test helper: mock link filtering.
	 *
	 * @param string $current_page  The link that might be filtered.
	 * @param bool   $filter_result False when url contains a fragment.
	 */
	protected function getFilterMock( $current_page, $filter_result ) {
		$filter = $this
			->getMockBuilder( 'WPSEO_Link_Filter' )
			->setConstructorArgs( array( $current_page ) )
			->getMock();

		$filter
			->expects( $this->once() )
			->method( 'internal_link_with_fragment_filter' )
			->will( $this->returnValue( $filter_result ) );

		return $filter;
	}
}
