<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Extractor_Test extends WPSEO_UnitTestCase {

	/**
	 * Test with no links in the text.
	 */
	public function test_extraction_no_links() {
		$extractor = new WPSEO_Link_Extractor( 'There are no links.' );

		$this->assertEquals( array(), $extractor->extract() );
	}

	/**
	 * Test with a link present in the text.
	 */
	public function test_extraction_with_links() {
		$extractor = new WPSEO_Link_Extractor( 'There is one <a href="http://www.test.com">link</a>a> in this test.' );

		$this->assertEquals( array( 'http://www.test.com' ), $extractor->extract() );
	}
}
