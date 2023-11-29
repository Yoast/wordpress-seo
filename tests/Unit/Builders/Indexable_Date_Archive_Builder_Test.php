<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Date_Archive_Builder_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder
 */
class Indexable_Date_Archive_Builder_Test extends TestCase {

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$options_mock = Mockery::mock( Options_Helper::class );
		$options_mock->expects( 'get' )->with( 'title-archive-wpseo' )->andReturn( 'date_archive_title' );
		$options_mock->expects( 'get' )->with( 'metadesc-archive-wpseo' )->andReturn( 'date_archive_meta_description' );
		$options_mock->expects( 'get' )->with( 'noindex-archive-wpseo' )->andReturn( false );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'date-archive' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'date_archive_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'date_archive_meta_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_public', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$indexable_mock->orm->expects( 'get' )->with( 'is_robots_noindex' )->andReturn( 0 );

		Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', null );
		$indexable_mock->orm->expects( 'set' )->with( 'version', 1 );

		$builder = new Indexable_Date_Archive_Builder( $options_mock, new Indexable_Builder_Versions() );
		$builder->build( $indexable_mock );
	}
}
