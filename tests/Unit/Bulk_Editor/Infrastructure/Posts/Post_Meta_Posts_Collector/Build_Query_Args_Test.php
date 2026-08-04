<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

use Mockery;
use ReflectionMethod;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

/**
 * Tests build_query_args.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector::build_query_args
 */
final class Build_Query_Args_Test extends Abstract_Post_Meta_Posts_Collector_Test {

	/**
	 * The statuses passed in the query.
	 *
	 * @var array<string>
	 */
	private const STATUSES = [ 'publish', 'draft', 'pending', 'future' ];

	/**
	 * Tests that the included post IDs restrict the query through post__in.
	 *
	 * @return void
	 */
	public function test_build_query_args_restricts_to_the_included_post_ids() {
		$args = $this->invoke_build_query_args( new Posts_Query( 'page', 1, 20, '', self::STATUSES, null, [], true, [ 5, 3 ] ) );

		$this->assertSame( [ 5, 3 ], $args['post__in'] );
	}

	/**
	 * Tests that post__in is left out when no post IDs are included.
	 *
	 * @return void
	 */
	public function test_build_query_args_without_included_post_ids() {
		$args = $this->invoke_build_query_args( new Posts_Query( 'page', 1, 20, '', self::STATUSES ) );

		$this->assertArrayNotHasKey( 'post__in', $args );
	}

	/**
	 * Invokes the private build_query_args on a real collector instance.
	 *
	 * The construction of the WP_Query consuming these arguments cannot be intercepted (the class name is
	 * already declared as a plain mock elsewhere in the suite, which rules out an overload mock), so the
	 * built arguments are asserted directly instead.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return array<string, string|int|bool|array<string>|array<int>> The built WP_Query arguments.
	 */
	private function invoke_build_query_args( Posts_Query $query ): array {
		$instance = new Post_Meta_Posts_Collector( $this->post_editability_resolver, Mockery::mock( Default_Template_Resolver::class ) );

		$reflection = new ReflectionMethod( $instance, 'build_query_args' );
		$reflection->setAccessible( true );

		return $reflection->invoke( $instance, $query );
	}
}
