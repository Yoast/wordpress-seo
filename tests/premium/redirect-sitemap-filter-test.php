<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for WPSEO_Redirect_Sitemap_Filter.
 *
 * @covers WPSEO_Redirect_Sitemap_Filter
 * @group  redirects
 */
class WPSEO_Redirect_Sitemap_Filter_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests filtering of sitemap entry with entry not being present as a redirect.
	 *
	 * @covers WPSEO_Redirect_Sitemap_Filter::filter_sitemap_entry
	 */
	public function test_filter_sitemap_entry_not_present_as_redirect() {
		$option = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search' ) )
			->getMock();

		$option
			->expects( $this->once() )
			->method( 'search' )
			->will( $this->returnValue( false ) );

		$sitemap_entry = array(
			'loc' => 'http://example.domain/not-present',
		);

		$instance = new WPSEO_Redirect_Sitemap_Filter( 'http://example.domain', $option );
		$this->assertEquals( $sitemap_entry, $instance->filter_sitemap_entry( $sitemap_entry ) );
	}

	/**
	 * Tests filtering of sitemap entry with entry being present as a redirect.
	 *
	 * @covers WPSEO_Redirect_Sitemap_Filter::filter_sitemap_entry
	 */
	public function test_filter_sitemap_entry_present_as_redirect() {
		$option = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search' ) )
			->getMock();

		$option
			->expects( $this->once() )
			->method( 'search' )
			->will( $this->returnValue( true ) );

		$sitemap_entry = array(
			'loc' => 'http://example.domain/present',
		);

		$instance = new WPSEO_Redirect_Sitemap_Filter( 'http://example.domain', $option );
		$this->assertFalse( $instance->filter_sitemap_entry( $sitemap_entry ) );
	}

	/**
	 * Tests filtering of sitemap entry with invalid input.
	 *
	 * @covers WPSEO_Redirect_Sitemap_Filter::filter_sitemap_entry
	 */
	public function test_filter_sitemap_entry_with_invalid_input() {
		$option = $this
			->getMockBuilder( 'WPSEO_Redirect_Option' )
			->setMethods( array( 'search' ) )
			->getMock();

		$option
			->expects( $this->never() )
			->method( 'search' );

		$sitemap_entry = array(
			'entry' => 'http://example.domain/present',
		);

		$instance = new WPSEO_Redirect_Sitemap_Filter( 'http://example.domain', $option );
		$this->assertEquals( $sitemap_entry, $instance->filter_sitemap_entry( $sitemap_entry ) );
	}

}
