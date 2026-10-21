<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Not_Found_Page_Template_Target;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Not_Found_Page_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Not_Found_Page_Template_Target
 */
final class Not_Found_Page_Template_Target_Test extends TestCase {

	/**
	 * Tests the name and sharing of the 404 pages.
	 *
	 * @covers ::get_name
	 * @covers ::is_shared
	 *
	 * @return void
	 */
	public function test_target() {
		$instance = new Not_Found_Page_Template_Target();

		$this->assertSame( 'not_found_page', $instance->get_name() );
		$this->assertTrue( $instance->is_shared() );
	}
}
