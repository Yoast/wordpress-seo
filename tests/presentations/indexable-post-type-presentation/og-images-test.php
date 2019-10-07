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
	public function test_with_opengraph_disabled() {
		$this->options_helper
			->expects( 'get' )
			->with( 'opengraph' )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the featured image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_for_password_protected_post() {
		$this->options_helper
			->expects( 'get' )
			->with( 'opengraph' )
			->once()
			->andReturnTrue();

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
		$this->options_helper
			->expects( 'get' )
			->with( 'opengraph' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->indexable->og_image    = 'facebook_image.jpg';
		$this->indexable->og_image_id = null;

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}
}
