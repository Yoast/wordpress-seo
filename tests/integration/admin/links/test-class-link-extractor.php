<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Link_Extractor
 */
class WPSEO_Link_Extractor_Test extends WPSEO_UnitTestCase {

	/**
	 * Test with no links in the text.
	 *
	 * @covers ::extract
	 */
	public function test_extraction_no_links() {
		$extractor = new WPSEO_Link_Extractor( 'There are no links.' );

		$this->assertEquals( [], $extractor->extract() );
	}

	/**
	 * Test with a link present in the text.
	 *
	 * @covers ::extract
	 */
	public function test_extraction_with_links() {
		$extractor = new WPSEO_Link_Extractor( 'There is one <a href="http://www.test.com">link</a>a> in this test.' );

		$this->assertEquals( [ 'http://www.test.com' ], $extractor->extract() );
	}
}
