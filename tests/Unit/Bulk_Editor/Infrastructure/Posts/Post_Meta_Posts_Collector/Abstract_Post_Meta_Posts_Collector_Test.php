<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Post_Meta_Posts_Collector tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Post_Meta_Posts_Collector_Test extends TestCase {

	/**
	 * Holds the post editability resolver.
	 *
	 * @var Mockery\MockInterface|Post_Editability_Resolver
	 */
	protected $post_editability_resolver;

	/**
	 * Holds the default template resolver.
	 *
	 * @var Mockery\MockInterface|Default_Template_Resolver
	 */
	protected $default_template_resolver;

	/**
	 * Holds the instance.
	 *
	 * The WP_Query is instantiated internally, so we partial-mock the run_query seam.
	 *
	 * @var Mockery\MockInterface|Post_Meta_Posts_Collector
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_editability_resolver = Mockery::mock( Post_Editability_Resolver::class );
		$this->default_template_resolver = Mockery::mock( Default_Template_Resolver::class );

		// Pass the stored value through unchanged by default; individual tests override when needed.
		$this->default_template_resolver->allows( 'resolve_seo_title' )->andReturnArg( 2 )->byDefault();
		$this->default_template_resolver->allows( 'resolve_meta_description' )->andReturnArg( 2 )->byDefault();

		$this->instance = Mockery::mock(
			Post_Meta_Posts_Collector::class,
			[ $this->post_editability_resolver, $this->default_template_resolver ],
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}
}
