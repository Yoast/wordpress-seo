<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Taxonomy
 */
class WPSEO_Taxonomy_Test extends TestCase {

	/**
	 * Make sure certain pages are marked as term edit.
	 *
	 * @covers ::is_term_edit
	 */
	public function test_is_term_edit() {
		$this->assertTrue( WPSEO_Taxonomy::is_term_edit( 'term.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( 'random' ) );
	}

	/**
	 * Make sure certain pages are marked as term overview.
	 *
	 * @covers ::is_term_overview
	 */
	public function test_is_term_overview() {
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'term.php' ) );
		$this->assertTrue( WPSEO_Taxonomy::is_term_overview( 'edit-tags.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'random' ) );
	}
}
