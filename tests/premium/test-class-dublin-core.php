<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Dublin core tests.
 */
class WPSEO_Dublin_Core_Test extends WPSEO_UnitTestCase {

	public function setUp() {
		parent::setUp();

		$this->go_to_home();
	}

	public function tearDown() {
		ob_clean();
	}

	/**
	 * @covers WPSEO_Dublin_Core::date_issued()
	 */
	public function test_dublin_core_date_issued() {

		$dublin_core = new WPSEO_Dublin_Core();

		$dublin_core->date_issued();
		$this->expectOutput( '' ); // No date on home page (not singular).

		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$dublin_core->date_issued();
		$dc_date_issued = '<meta property="DC.date.issued" content="' . get_the_date( DATE_W3C ) . '" />' . "\n";
		$this->expectOutput( $dc_date_issued );
	}
}