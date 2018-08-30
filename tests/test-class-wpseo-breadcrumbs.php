<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Breadcrumbs_Test extends WPSEO_UnitTestCase {

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 */
	/*public function test_breadcrumb_home() {

		// Test for home breadcrumb.
		$expected = '<span prefix="v: http://rdf.data-vocabulary.org/#">
			<span typeof="v:Breadcrumb"><span class="breadcrumb_last" property="v:title">Home</span></span>
		</span>';
		$output = WPSEO_Breadcrumbs::breadcrumb( '', '', false );
		$this->assertSame( $expected, trim( $output ) );

		// @todo Test actual breadcrumb output.
	}*/

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 */
	public function test_breadcrumb_before() {

		// Test before argument.
		$output   = WPSEO_Breadcrumbs::breadcrumb( 'before', '', false );
		$expected = 'before';
		$this->assertStringStartsWith( $expected, $output );

		// @todo Test actual breadcrumb output.
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors.
	 */
	public function test_breadcrumb_after() {

		// Test after argument.
		$output   = WPSEO_Breadcrumbs::breadcrumb( '', 'after', false );
		$expected = 'after';
		$this->assertStringEndsWith( $expected, $output );

		// @todo Test actual breadcrumb output.
	}

	/**
	 * Tests getting the url for a private post.
	 *
	 * @covers WPSEO_Breadcrumbs::get_link_url_for_id()
	 */
	public function test_getting_url_of_private_post() {
		$breadcrumbs = new WPSEO_Breadcrumbs_Double();

		$post = $this->factory()->post->create_and_get( array( 'post_status' => 'private' ) );
		$this->assertEquals( '', $breadcrumbs->get_link_url_for_id( $post->ID ) );
	}

	/**
	 * Tests getting the url for a public post.
	 *
	 * @covers WPSEO_Breadcrumbs::get_link_url_for_id()
	 */
	public function test_getting_url_of_public_post() {
		$breadcrumbs = new WPSEO_Breadcrumbs_Double();

		$post = $this->factory()->post->create_and_get();
		$this->assertEquals( get_permalink( $post->ID ), $breadcrumbs->get_link_url_for_id( $post->ID ) );
	}

	/**
	 * Tests getting the url for a non existing post id.
	 *
	 * @covers WPSEO_Breadcrumbs::get_link_url_for_id()
	 */
	public function test_getting_url_of_a_non_existing_post() {
		$breadcrumbs = new WPSEO_Breadcrumbs_Double();

		$this->assertEquals( '', $breadcrumbs->get_link_url_for_id( 0 ) );
	}
}
