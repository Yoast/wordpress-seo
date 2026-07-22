<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;

/**
 * Tests the Post_Editability_Resolver constructor.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver::__construct
 */
final class Constructor_Test extends Abstract_Post_Editability_Resolver_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Post_Access_Checker_Interface::class,
			$this->getPropertyValue( $this->instance, 'post_access_checker' ),
		);
	}
}
