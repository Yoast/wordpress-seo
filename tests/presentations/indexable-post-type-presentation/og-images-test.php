<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class OG_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group opengraph
 * @group opengraph-image
 */
class OG_Images_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the featured image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_for_password_protected_post() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the og image is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_image() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->indexable->og_image    = 'facebook_image.jpg';
		$this->indexable->og_image_id = null;

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the featured image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_featured_image_id() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->andReturn( 1 );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturn( 'facebook_image.jpg' );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the content image is used.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_content_image() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->andReturn( 1 );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturnFalse();

		$this->image_helper
			->expects( 'get_post_content_image' )
			->once()
			->andReturn( 'facebook_image.jpg'  );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the default og image is given.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_the_default_og_image() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->andReturnFalse();

		$this->image_helper
			->expects( 'get_post_content_image' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( [ 'default_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where no situation is applicable.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_no_applicable_situation() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->image_helper
			->expects( 'get_featured_image_id' )
			->once()
			->andReturnFalse();

		$this->image_helper
			->expects( 'get_post_content_image' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [], $this->instance->generate_og_images() );
	}
}
