<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Post_Builder
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

		$builder = new Indexable_Post_Type_Archive_Builder( $options_mock );
		$builder->build( 'my-post-type', $indexable_mock );
	}
}
