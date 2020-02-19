<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Rebuilder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\WPSEO_Titles_Option_Watcher;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class WPSEO_Titles_Option_Watcher.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\WPSEO_Titles_Option_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class WPSEO_Titles_Option_Watcher_Test extends TestCase {

	/**
	 * Indexable rebuilder mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Rebuilder
	 */
	private $rebuilder;

	/**
	 * Post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type;

	/**
	 * The class instance.
	 *
	 * @var WPSEO_Titles_Option_Watcher
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		$this->rebuilder = Mockery::mock( Indexable_Rebuilder::class );
		$this->post_type = Mockery::mock( Post_Type_Helper::class );
		$this->instance  = Mockery::mock(
			WPSEO_Titles_Option_Watcher::class,
			[ $this->rebuilder, $this->post_type ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			WPSEO_Titles_Option_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_wpseo_titles' ] ) );
	}

	/**
	 * Tests that nothing happens when the arguments are not arrays.
	 *
	 * @covers ::check_wpseo_titles
	 */
	public function test_check_wpseo_titles_wrong_arguments() {
		$this->instance->expects( 'check_and_build_author_archive' )->never();

		$this->instance->check_wpseo_titles( false, [] );
		$this->instance->check_wpseo_titles( [], 'string' );
		$this->instance->check_wpseo_titles( false, 'string' );
	}

	/**
	 * Tests that nothing happens without a difference between the two option arguments.
	 *
	 * @covers ::check_wpseo_titles
	 * @covers ::check_and_build_author_archive
	 * @covers ::check_and_build_date_archive
	 */
	public function test_check_wpseo_titles_no_changes() {
		$this->post_type->expects( 'get_public_post_types' )->never();
		$this->rebuilder->expects( 'rebuild_for_type' )->with( 'user' )->never();
		$this->rebuilder->expects( 'rebuild_for_date_archive' )->never();

		$this->instance->check_wpseo_titles( [], [] );
	}

	/**
	 * Tests that the author archive indexable is not build without a change in the date archive settings.
	 *
	 * @covers ::check_wpseo_titles
	 * @covers ::check_and_build_author_archive
	 * @covers ::check_and_build_date_archive
	 */
	public function test_check_wpseo_titles_no_author_archive_changes() {
		$this->post_type
			->expects( 'get_public_post_types' )
			->once()
			->andReturn(
				[
					'post',
					'page',
					'foo',
				]
			);

		$this->rebuilder->expects( 'rebuild_for_type' )->with( 'user' )->never();
		$this->rebuilder->expects( 'rebuild_for_date_archive' )->once();

		// There have to be other changes in order to get to the date archive part.
		$this->instance->check_wpseo_titles(
			[
				'noindex-archive-wpseo' => '123',
			],
			[
				'noindex-archive-wpseo' => '456',
			]
		);
	}

	/**
	 * Tests that the date archive indexable is not build without a change in the date archive settings.
	 *
	 * @covers ::check_wpseo_titles
	 * @covers ::check_and_build_author_archive
	 * @covers ::check_and_build_date_archive
	 */
	public function test_check_wpseo_titles_no_date_archive_changes() {
		$this->post_type
			->expects( 'get_public_post_types' )
			->once()
			->andReturn(
				[
					'post',
					'page',
					'foo',
				]
			);

		$this->rebuilder->expects( 'rebuild_for_type' )->with( 'user' )->never();
		$this->rebuilder->expects( 'rebuild_for_type' )->with( 'user' )->once();
		$this->rebuilder->expects( 'rebuild_for_date_archive' )->never();

		$this->instance->check_wpseo_titles(
			[
				'noindex-author-wpseo'         => '123',
				'noindex-author-noposts-wpseo' => '123',
			],
			[
				'noindex-author-wpseo'         => '456',
				'noindex-author-noposts-wpseo' => '456',
			]
		);
	}

	/**
	 * Tests all (happy path) scenarios to cover the big foreach.
	 *
	 * @covers ::check_wpseo_titles
	 * @covers ::check_and_build_author_archive
	 * @covers ::check_and_build_date_archive
	 */
	public function test_check_wpseo_titles_with_changes() {
		$this->post_type
			->expects( 'get_public_post_types' )
			->once()
			->andReturn(
				[
					'post',
					'page',
					'foo',
					'bar',
					'baz',
				]
			);

		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'term', 'post_tag' )->once();
		$this->rebuilder->expects( 'rebuild_for_post_type_archive' )->with( 'post' )->once();
		$this->rebuilder->expects( 'rebuild_for_post_type_archive' )->with( 'page' )->once();
		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'post', 'post' )->once();
		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'post', 'page' )->once();
		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'post', 'bar' )->once();
		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'post', 'baz' )->once();
		$this->rebuilder->expects( 'rebuild_for_type_and_sub_type' )->with( 'post', 'foo' )->never();

		$this->instance->check_wpseo_titles(
			[
				'noindex-tax-post_tag'    => '123',
				'metadesc-ptarchive-post' => '123',
				'noindex-ptarchive-page'  => '123',
				'noindex-post'            => '123',
				'noindex-page'            => '123',
				'noindex-bar'             => '123',
			],
			[
				'noindex-tax-post_tag'    => '456',
				'metadesc-ptarchive-post' => '456',
				'noindex-ptarchive-page'  => '456',
				'noindex-post'            => '456',
				'noindex-page'            => '456',
				'noindex-baz'             => '456',
			]
		);
	}
}
