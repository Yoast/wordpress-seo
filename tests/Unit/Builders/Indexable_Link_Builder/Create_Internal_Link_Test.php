<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;

/**
 * Class Create_Internal_Link_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Create_Internal_Link_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Tests the build in case of an image link and 'disable attachment` optionis false.
	 *
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 * @covers ::build_permalink
	 * @covers ::get_permalink
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 * @covers ::update_related_indexables
	 *
	 * @return void
	 */
	public function test_build_create_internal_link() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model       = new SEO_Links_Mock();
		$model->type = SEO_Links::TYPE_INTERNAL_IMAGE;

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5' => 2 ] );

		Functions\stubs(
			[
				// Executed in build->create_links->create_internal_link.
				'home_url'       => 'http://basic.wordpress.test',

				// Executed in build->create_links->create_internal_link.
				'wp_parse_url'   => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],
			]
		);

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->expect_seo_links_repository_query_create( $indexable, $model );

		$this->expect_build_permalink( 'http://basic.wordpress.test' );

		// Executed in build->create_links->create_internal_link.
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( false );

		// Executed in build->create_links->create_internal_link->enhance_link_from_indexable.
		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->once()
			->with( 'http://basic.wordpress.test' )
			->andReturn( false );

		// Executed in build->create_links->create_internal_link->enhance_link_from_indexable->get_post_id.
		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'http://basic.wordpress.test' )
			->andReturn( 0 );

		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, [ $model ] );

		$this->instance->build( $indexable, '<img width="640" height="480" src="' . $this->image_url . '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' );
	}

	/**
	 * Tests the build in case of an image link and 'disable attachment` optionis false.
	 *
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 * @covers ::build_permalink
	 * @covers ::get_permalink
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 * @covers ::update_related_indexables
	 *
	 * @return void
	 */
	public function test_build_create_internal_link_disable_attachment_true_file_doesnt_exist() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model                 = new SEO_Links_Mock();
		$model->type           = SEO_Links::TYPE_INTERNAL_IMAGE;
		$model->target_post_id = 2;

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5' => 2 ] );

		// Executed in build->create_links->create_internal_link.
		Functions\stubs(
			[
				'home_url'                    => 'http://basic.wordpress.test',
				'wp_parse_url'                => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],
				'get_attached_file'           => 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg',
			]
		);

		// Executed in build->create_links->create_internal_link.
		Functions\expect( 'wp_get_attachment_image_src' )
			->once()
			->with( $model->target_post_id, 'full' )
			->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg', '640', '480' ] );

		$model->width  = '640';
		$model->height = '480';

		$this->assertSame( $model->height, '480' );

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->expect_seo_links_repository_query_create( $indexable, $model );

		$this->expect_build_permalink( 'http://basic.wordpress.test' );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( true );

		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, [ $model ] );

		$this->instance->build( $indexable, '<img width="640" height="480" src="' . $this->image_url . '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' );
	}

	/**
	 * Tests the build in case of an image link and 'disable attachment` option is false.
	 *
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 * @covers ::build_permalink
	 * @covers ::get_permalink
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 * @covers ::update_related_indexables
	 *
	 * @return void
	 */
	public function test_build_create_internal_link_disable_attachment_true_file_exist() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model                 = new SEO_Links_Mock();
		$model->type           = SEO_Links::TYPE_INTERNAL_IMAGE;
		$model->target_post_id = 5;
		$model->height         = null;
		$model->width          = null;

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5' => 2 ] );

		// Executed in build->create_links->create_internal_link.
		Functions\stubs(
			[

				'home_url'                    => 'http://basic.wordpress.test',
				'wp_parse_url'                => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],
				'get_attached_file'           => 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg',
				'wp_get_attachment_image_src' => [ '55', '200', '300' ],
			]
		);

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->expect_seo_links_repository_query_create( $indexable, $model );

		$this->expect_build_permalink( 'http://basic.wordpress.test' );

		// Executed in build->create_links->create_internal_link.
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( true );

		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, [ $model ] );

		$this->instance->build( $indexable, '<img width="640" height="480" src="' . $this->image_url . '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' );
	}

	/**
	 * Tests the build in case of an image link and 'disable attachment` option is true.
	 *
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 * @covers ::build_permalink
	 * @covers ::get_permalink
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 * @covers ::update_related_indexables
	 *
	 * @return void
	 */
	public function test_build_create_internal_link_disable_attachment_true_file_not_found() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 2;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model                 = new SEO_Links_Mock();
		$model->type           = SEO_Links::TYPE_INTERNAL_IMAGE;
		$model->target_post_id = 3;

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5' => 2 ] );

		Functions\stubs(
			[
				// Executed in build->create_links->create_internal_link.
				'home_url'                    => 'http://basic.wordpress.test',

				// Executed in build->create_links->create_internal_link.
				'wp_parse_url'                => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],

				// Executed in build->create_links->create_internal_link.
				'wp_get_attachment_image_src' => [ '55', '200', '300' ],
			]
		);

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->expect_seo_links_repository_query_create( $indexable, $model );

		// Executed in build->create_links->create_internal_link.
		Functions\when( 'file_exists' )
			->justReturn( true );

		// Executed in build->create_links->create_internal_link.
		Functions\when( 'filesize' )
			->justReturn( '500' );

		// Executed in build->create_links->create_internal_link.
		Functions\when( 'get_attached_file' )
			->justReturn( null );

		$this->expect_build_permalink( 'http://basic.wordpress.test' );

		// Executed in build->create_links->create_internal_link.
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( true );

		// Executed in build.
		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, [ $model ] );

		$this->instance->build( $indexable, '<img width="640" height="480" src="' . $this->image_url . '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' );
	}

	/**
	 * Tests the build in case of an image link and 'disable attachment` option is true.
	 *
	 * @covers ::build
	 * @covers ::create_links
	 * @covers ::create_internal_link
	 * @covers ::build_permalink
	 * @covers ::get_permalink
	 * @covers ::enhance_link_from_indexable
	 * @covers ::get_post_id
	 * @covers ::update_related_indexables
	 *
	 * @return void
	 */
	public function test_build_create_internal_link_disable_attachment_true_get_attachment_by_url_not_empty() {

		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->id          = 1;
		$indexable->object_id   = 9;
		$indexable->object_type = 'page';
		$indexable->permalink   = 'https://site.com/page';

		$model                 = new SEO_Links_Mock();
		$model->type           = SEO_Links::TYPE_INTERNAL_IMAGE;
		$model->target_post_id = 2;

		$this->indexable_helper->expects( 'should_index_indexable' )->once()->andReturn( true );
		$this->image_content_extractor->expects( 'gather_images' )->once()->andReturn( [ 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg?quality=90&amp;grain=0.5' => 2 ] );

		Functions\stubs(
			[
				// Executed in build->create_links.
				'home_url'                    => 'http://basic.wordpress.test',

				// Executed in build->create_links->create_internal_link.
				'wp_parse_url'                => [
					'scheme' => 'http',
					'host'   => 'basic.wordpress.test',
				],

				// Executed in build->create_links->create_internal_link.
				'get_attached_file'           => 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg',

				'wp_get_attachment_image_src' => [ '55', '200', '300' ],

				// Executed in build->create_links->create_internal_link->WPSEO_Image_Utils::get_attachment_by_url->attachment_url_to_postid.
				'wp_cache_get'                => 108,
			]
		);

		// Executed in build->create_links->create_internal_link.
		$this->url_helper
			->expects( 'get_link_type' )
			->once()
			->andReturn( SEO_Links::TYPE_INTERNAL_IMAGE );

		// Executed in build->create_links->create_internal_link.
		$this->expect_seo_links_repository_query_create( $indexable, $model );

		// Executed in build->create_links->create_internal_link.
		$this->expect_build_permalink( 'http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg' );

		// Executed in build->create_links->create_internal_link.
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'disable-attachment' )
			->andReturn( true );

		// Executed in build.
		$this->expect_update_related_indexables_with_links_to_add( $indexable->id, [ $model ] );

		$this->instance->build( $indexable, '<img width="640" height="480" src="' . $this->image_url . '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" loading="lazy" srcset="http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8.jpg 640w, http://basic.wordpress.test/wp-content/uploads/2022/11/WordPress8-300x225.jpg 300w" sizes="(max-width: 640px) 100vw, 640px">' );
	}
}
