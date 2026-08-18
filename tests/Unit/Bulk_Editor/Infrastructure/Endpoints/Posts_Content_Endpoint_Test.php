<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Endpoints;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Endpoints\Posts_Content_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Posts_Content_Endpoint class.
 *
 * @group bulk-editor
 *
 * @coversDefaultClass Yoast\WP\SEO\Bulk_Editor\Infrastructure\Endpoints\Posts_Content_Endpoint
 */
final class Posts_Content_Endpoint_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_Content_Endpoint
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Posts_Content_Endpoint();
	}

	/**
	 * Tests if the name is the expected value.
	 *
	 * The name is the key the URL is localized under, which Premium reads to find this endpoint; changing it
	 * silently breaks the client-side prompt content collection.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'posts_content', $this->instance->get_name() );
	}

	/**
	 * Tests if the namespace is the expected value.
	 *
	 * @covers ::get_namespace
	 *
	 * @return void
	 */
	public function test_get_namespace() {
		$this->assertSame( 'yoast/v1', $this->instance->get_namespace() );
	}

	/**
	 * Tests if the route is the expected value.
	 *
	 * @covers ::get_route
	 *
	 * @return void
	 */
	public function test_get_route() {
		$this->assertSame( '/bulk_editor/posts_content', $this->instance->get_route() );
	}

	/**
	 * Tests if the rest URL is the expected value.
	 *
	 * @covers ::get_url
	 *
	 * @return void
	 */
	public function test_get_url() {
		Functions\expect( 'rest_url' )
			->once()
			->with( 'yoast/v1/bulk_editor/posts_content' )
			->andReturnFirstArg();

		$this->assertSame( 'yoast/v1/bulk_editor/posts_content', $this->instance->get_url() );
	}
}
