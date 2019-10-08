<?php

namespace Yoast\WP\Free\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Search_Result_Builder;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\Free\Builders\Indexable_Author_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Search_Result_Builder_Test extends TestCase {

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$options_helper_mock = Mockery::mock( Options_Helper::class );
		$options_helper_mock->expects( 'get' )->with( 'title-search-wpseo' )->andReturn( 'search_title' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'search-result' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'search_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );

		$builder = new Indexable_Search_Result_Builder( $options_helper_mock );
		$builder->build( $indexable_mock );
	}
}
