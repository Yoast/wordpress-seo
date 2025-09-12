<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Available_Posts;

use Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection;

/**
 * Tests the Available_Posts_Repository constructor.
 *
 * @group llms.txt
 *
 * @covers \Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository::__construct
 */
final class Constructor_Test extends Abstract_Available_Posts_Repository_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Automatic_Post_Collection::class,
			$this->getPropertyValue( $this->instance, 'automatic_post_collection' )
		);
	}
}
