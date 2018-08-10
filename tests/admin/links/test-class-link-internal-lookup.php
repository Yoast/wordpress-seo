<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Internal_Lookup_Test extends WPSEO_UnitTestCase {

	/**
	 * Test with an internal link.
	 */
	public function test_lookup_internal() {
		$post   = $this->factory->post->create_and_get();
		$lookup = new WPSEO_Link_Internal_Lookup();

		$this->assertEquals(
			$post->ID,
			$lookup->lookup( get_permalink( $post ) )
		);
	}

	/**
	 * Test with a relative internal link
	 */
	public function test_lookup_internal_relative() {
		$post   = $this->factory->post->create_and_get();
		$lookup = new WPSEO_Link_Internal_Lookup();

		$this->assertEquals(
			$post->ID,
			$lookup->lookup( '?p=' . $post->ID )
		);
	}

	/**
	 * Test with an external link set a as internal.
	 */
	public function test_lookup_external_used_as_internal() {
		$lookup = new WPSEO_Link_Internal_Lookup();

		$this->assertEquals(
			0,
			$lookup->lookup( 'http://external.dev' )
		);
	}

	/**
	 * Test with an external link.
	 */
	public function test_lookup_external() {
		$lookup = new WPSEO_Link_Internal_Lookup();

		$this->assertEquals(
			0,
			$lookup->lookup( 'http://external.dev' )
		);
	}
}
