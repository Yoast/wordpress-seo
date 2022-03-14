<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Post_Builder
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Post_Type_Archive_Builder_Test extends TestCase {

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$options_mock = Mockery::mock( Options_Helper::class );
		$options_mock->expects( 'get' )->with( 'title-ptarchive-my-post-type' )->andReturn( 'my_post_type_title' );
		$options_mock->expects( 'get' )->with( 'metadesc-ptarchive-my-post-type' )->andReturn( 'my_post_type_meta_description' );
		$options_mock->expects( 'get' )->with( 'bctitle-ptarchive-my-post-type' )->andReturn( 'my_post_type_breadcrumb_title' );
		$options_mock->expects( 'get' )->with( 'noindex-ptarchive-my-post-type' )->andReturn( false );
		Monkey\Functions\expect( 'get_post_type_archive_link' )->with( 'my-post-type' )->andReturn( 'https://permalink' );

		$versions = Mockery::mock( Indexable_Builder_Versions::class );
		$versions
			->expects( 'get_latest_version_for_type' )
			->with( 'post-type-archive' )
			->andReturn( 1 );

		$post_helper = Mockery::mock( Post_Helper::class );
		$post_helper->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$wpdb        = Mockery::mock( 'wpdb' );
		$wpdb->posts = 'wp_posts';
		$wpdb->expects( 'prepare' )->once()->with(
			"
			SELECT MAX(p.post_modified_gmt) AS last_modified, MIN(p.post_date_gmt) AS published_at
			FROM {$wpdb->posts} AS p
			WHERE p.post_status IN (%s)
				AND p.post_password = ''
				AND p.post_type = %s
		",
			[ 'publish', 'my-post-type' ]
		)->andReturn( 'PREPARED_QUERY' );
		$wpdb->expects( 'get_row' )->once()->with( 'PREPARED_QUERY' )->andReturn(
			(object) [
				'last_modified' => '1234-12-12 00:00:00',
				'published_at'  => '1234-12-12 00:00:00',
			]
		);

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'post-type-archive' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_sub_type', 'my-post-type' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'my_post_type_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'my_post_type_breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'my_post_type_meta_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_public', true );
		$indexable_mock->orm->expects( 'get' )->with( 'is_robots_noindex' )->andReturnFalse();

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'version', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_published_at', '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 00:00:00' );

		$builder = new Indexable_Post_Type_Archive_Builder( $options_mock, $versions, $post_helper, $wpdb );
		$builder->build( 'my-post-type', $indexable_mock );
	}
}
