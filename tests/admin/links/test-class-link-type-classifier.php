<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
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
	 * @dataProvider provider_urls
	 *
	 * @param string $base_url        URL.
	 * @param string $url_to_classify URL to classify.
	 * @param string $expected        Expected output.
	 */
	public function test_classify( $base_url, $url_to_classify, $expected ) {
		$classifier = new WPSEO_Link_Type_Classifier( $base_url );

		$this->assertEquals( $expected, $classifier->classify( $url_to_classify ) );
	}

	/**
	 * @return array
	 */
	public function provider_urls() {
		return array(
			array( 'http://example.com', 'page', 'internal' ),
			array( 'http://example.com', 'http://example.com/page', 'internal' ),
			array( 'https://example.com', 'http://example.com/page', 'internal' ),
			array( 'http://example.com', 'http://test.com/page', 'external' ),
			array( 'http://example.com', 'http://dev.example.com', 'external' ),
			array( 'http://example.com/subdirectory', 'http://example.com/subdirectory2/', 'external' ),
			array( 'http://example.com/subdirectory', 'http://example.com/subdirectory/hi?query=set', 'internal' ),
			array( 'http://example.com', 'mailto:johndoe@example.com', 'external' ),
			array( 'http://example.com', 'mailto:example.com', 'external' ),
		);
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
			->with( wp_parse_url( 'http://test.com/page' ) )
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
			->with( wp_parse_url( 'http://test.com/page' ) )
			->will( $this->returnValue( true ) );

		$classifier->classify( 'http://test.com/page' );
	}
}


