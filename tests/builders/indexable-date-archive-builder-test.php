<?php

namespace Yoast\WP\Free\Tests\Builders;

use Mockery;
use Yoast\WP\Free\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Date_Archive_Builder_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\Free\Builders\Indexable_Date_Archive_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Date_Archive_Builder_Test extends TestCase {

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$options_helper_mock = Mockery::mock( Options_Helper::class );
		$options_helper_mock->expects( 'get' )->with( 'title-archive-wpseo' )->andReturn( 'date_archive_title' );
		$options_helper_mock->expects( 'get' )->with( 'breadcrumbs-archiveprefix' )->andReturn( 'date_archive_breadcrumb_prefix' );
		$options_helper_mock->expects( 'get' )->with( 'metadesc-archive-wpseo' )->andReturn( 'date_archive_meta_description' );
		$options_helper_mock->expects( 'get' )->with( 'noindex-archive-wpseo' )->andReturn( false );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'date-archive' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'date_archive_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'date_archive_breadcrumb_prefix' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'date_archive_meta_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );

		$builder = new Indexable_Date_Archive_Builder( $options_helper_mock );
		$builder->build( $indexable_mock );
	}
}
