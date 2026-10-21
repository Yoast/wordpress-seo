<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Search_Page_Template_Target;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Search_Page_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Search_Page_Template_Target
 */
final class Search_Page_Template_Target_Test extends TestCase {

	/**
	 * Tests the name and sharing of the search results pages.
	 *
	 * @covers ::get_name
	 * @covers ::is_shared
	 *
	 * @return void
	 */
	public function test_target() {
		$instance = new Search_Page_Template_Target();

		$this->assertSame( 'search_page', $instance->get_name() );
		$this->assertTrue( $instance->is_shared() );
	}
}
