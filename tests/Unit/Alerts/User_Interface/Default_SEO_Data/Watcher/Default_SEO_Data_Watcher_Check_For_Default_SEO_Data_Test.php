<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Watcher;

use Generator;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Test class for the check_for_default_seo_data method.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Watcher::check_for_default_seo_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Watcher_Check_For_Default_SEO_Data_Test extends Abstract_Default_SEO_Data_Watcher_Test {

	/**
	 * Tests the check_for_default_seo_data method.
	 *
	 * @dataProvider check_for_default_seo_data_provider
	 *
	 * @param string      $object_type            The object type of the indexable.
	 * @param string      $object_sub_type        The object sub type of the indexable.
	 * @param string|null $title                  The title of the indexable.
	 * @param string|null $description            The description of the indexable.
	 * @param int         $get_post_subtype_times The number of times the object_sub_type is fetched.
	 * @param int         $get_title_times        The number of times the title is fetched.
	 * @param int         $get_description_times  The number of times the description is fetched.
	 * @param int         $set_title_times        The number of times the title option should be set.
	 * @param int         $set_description_times  The number of times the description option should be set.
	 *
	 * @return void
	 */
	public function test_check_for_default_seo_data(
		$object_type,
		$object_sub_type,
		$title,
		$description,
		$get_post_subtype_times,
		$get_title_times,
		$get_description_times,
		$set_title_times,
		$set_description_times
	) {
		$saved_indexable      = Mockery::mock( Indexable::class );
		$saved_indexable->orm = Mockery::mock( ORM::class );

		$saved_indexable->orm->expects( 'get' )->with( 'object_type' )->times( 1 )->andReturn( $object_type );
		$saved_indexable->orm->expects( 'get' )->with( 'object_sub_type' )->times( $get_post_subtype_times )->andReturn( $object_sub_type );
		$saved_indexable->orm->expects( 'get' )->with( 'title' )->times( $get_title_times )->andReturn( $title );
		$saved_indexable->orm->expects( 'get' )->with( 'description' )->times( $get_description_times )->andReturn( $description );

		$this->options_helper
			->expects( 'set' )
			->times( $set_title_times )
			->with( 'default_seo_title', [] );

		$this->options_helper
			->expects( 'set' )
			->times( $set_description_times )
			->with( 'default_seo_meta_desc', [] );

		$this->instance->check_for_default_seo_data( $saved_indexable );
	}

	/**
	 * Data provider for the test_check_for_default_seo_data test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function check_for_default_seo_data_provider() {
		yield 'Non-post object type - early return' => [
			'object_type'            => 'term',
			'object_sub_type'        => 'category',
			'title'                  => 'Some title',
			'description'            => 'Some description',
			'get_post_subtype_times' => 0,
			'get_title_times'        => 0,
			'get_description_times'  => 0,
			'set_title_times'        => 0,
			'set_description_times'  => 0,
		];

		yield 'Non-post object sub type - early return' => [
			'object_type'            => 'post',
			'object_sub_type'        => 'page',
			'title'                  => 'Some title',
			'description'            => 'Some description',
			'get_post_subtype_times' => 1,
			'get_title_times'        => 0,
			'get_description_times'  => 0,
			'set_title_times'        => 0,
			'set_description_times'  => 0,
		];

		yield 'Post with null title and null description - no options reset' => [
			'object_type'            => 'post',
			'object_sub_type'        => 'post',
			'title'                  => null,
			'description'            => null,
			'get_post_subtype_times' => 1,
			'get_title_times'        => 1,
			'get_description_times'  => 1,
			'set_title_times'        => 0,
			'set_description_times'  => 0,
		];

		yield 'Post with non-null title and null description - reset title option only' => [
			'object_type'            => 'post',
			'object_sub_type'        => 'post',
			'title'                  => 'Custom title',
			'description'            => null,
			'get_post_subtype_times' => 1,
			'get_title_times'        => 1,
			'get_description_times'  => 1,
			'set_title_times'        => 1,
			'set_description_times'  => 0,
		];

		yield 'Post with null title and non-null description - reset description option only' => [
			'object_type'            => 'post',
			'object_sub_type'        => 'post',
			'title'                  => null,
			'description'            => 'Custom description',
			'get_post_subtype_times' => 1,
			'get_title_times'        => 1,
			'get_description_times'  => 1,
			'set_title_times'        => 0,
			'set_description_times'  => 1,
		];

		yield 'Post with non-null title and non-null description - reset both options' => [
			'object_type'            => 'post',
			'object_sub_type'        => 'post',
			'title'                  => 'Custom title',
			'description'            => 'Custom description',
			'get_post_subtype_times' => 1,
			'get_title_times'        => 1,
			'get_description_times'  => 1,
			'set_title_times'        => 1,
			'set_description_times'  => 1,
		];
	}
}
