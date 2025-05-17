<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Images\Application\Image_Content_Extractor;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Indexable_Link_Builder_TestCase class for all Indexable_Link_Builder tests.
 */
abstract class Abstract_Indexable_Link_Builder_TestCase extends TestCase {

	/**
	 * The SEO links repository.
	 *
	 * @var Mockery\MockInterface|SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The url helper.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url_helper;

	/**
	 * The image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The post helper.
	 *
	 * @var Mockery\MockInterface|Post_Helper
	 */
	protected $post_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The test instance.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $instance;

	/**
	 * The url for an image.
	 *
	 * @var string
	 */
	protected $image_url;

	/**
	 *  The Image content extractor instance.
	 *
	 * @var Mockery\MockInterface|Image_Content_Extractor
	 */
	protected $image_content_extractor;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->seo_links_repository    = Mockery::mock( SEO_Links_Repository::class );
		$this->url_helper              = Mockery::mock( Url_Helper::class );
		$this->indexable_repository    = Mockery::mock( Indexable_Repository::class );
		$this->image_helper            = Mockery::mock( Image_Helper::class );
		$this->post_helper             = Mockery::mock( Post_Helper::class );
		$this->options_helper          = Mockery::mock( Options_Helper::class );
		$this->indexable_helper        = Mockery::mock( Indexable_Helper::class );
		$this->image_content_extractor = Mockery::mock( Image_Content_Extractor::class );

		$this->instance = new Indexable_Link_Builder(
			$this->seo_links_repository,
			$this->url_helper,
			$this->post_helper,
			$this->options_helper,
			$this->indexable_helper,
			$this->image_content_extractor
		);
		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );

		Functions\expect( 'wp_list_pluck' )->andReturnUsing(
			static function ( $haystack, $prop ) {
				return \array_map(
					static function ( $e ) use ( $prop ) {
						return $e->{$prop};
					},
					$haystack
				);
			}
		);

		$this->image_url = 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5';
	}

	/**
	 * Expectations for update_related_indexables.
	 *
	 * @param int   $indexable_id          The indexable id.
	 * @param array $insert_links          The links to insert.
	 * @param array $links_by_indexable_id The links by indexable id.
	 *
	 * @return void
	 */
	public function expect_update_related_indexables_with_links_to_add( $indexable_id, $insert_links, $links_by_indexable_id = [] ) {

		$this->seo_links_repository
			->expects( 'find_all_by_indexable_id' )
			->once()
			->with( $indexable_id )
			->andReturn( $links_by_indexable_id );

		$this->seo_links_repository
			->expects( 'insert_many' )
			->once()
			->with( $insert_links );
	}

	/**
	 * Expectations for build_permalink.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return void
	 */
	public function expect_build_permalink( $permalink ) {

		// Executed in build->create_links->create_internal_link->build_permalink->get_permalink.
		Functions\when( 'set_url_scheme' )
		->justReturn( 'http://basic.wordpress.test' );

		$this->url_helper
			->expects( 'is_relative' )
			->once()
			->andReturn( true );

		$this->url_helper
			->expects( 'ensure_absolute_url' )
			->once()
			->andReturn( $permalink );
	}

	/**
	 * Expectations for seo_links_repository->query->create.
	 *
	 * @param object $indexable The indexable.
	 * @param object $seo_link  The seo link.
	 *
	 * @return void
	 */
	public function expect_seo_links_repository_query_create( $indexable, $seo_link ) {

		$query_mock = Mockery::mock( ORM::class );

		$this->seo_links_repository->expects( 'query' )->once()->andReturn( $query_mock );

		$query_mock->expects( 'create' )->once()->with(
			[
				'url'          => $this->image_url,
				'type'         => SEO_Links::TYPE_INTERNAL_IMAGE,
				'indexable_id' => $indexable->id,
				'post_id'      => $indexable->object_id,
			]
		)->andReturn( $seo_link );
	}
}
