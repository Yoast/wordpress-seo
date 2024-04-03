<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Mockery;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Twitter\Images;

/**
 * Class Twitter_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Twitter_Image_Generator
 *
 * @group generators
 * @group twitter
 * @group twitter-image
 */
final class Twitter_Image_Generator_Test extends TestCase {

	/**
	 * Twitter image generator mock.
	 *
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image;

	/**
	 * Image helper mock.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * URL helper mock.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url;

	/**
	 * Instance under test.
	 *
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Images container mock.
	 *
	 * @var Mockery\MockInterface|Images
	 */
	protected $image_container;

	/**
	 * Meta tags context mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image           = Mockery::mock( Image_Helper::class );
		$this->url             = Mockery::mock( Url_Helper::class );
		$this->twitter_image   = Mockery::mock( Twitter_Image_Helper::class, [ $this->image ] );
		$this->image_container = Mockery::mock( Images::class, [ $this->image, $this->url ] )->makePartial();

		$this->instance = Mockery::mock(
			Twitter_Image_Generator::class,
			[ $this->image, $this->url, $this->twitter_image ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->instance
			->expects( 'get_image_container' )
			->once()
			->andReturn( $this->image_container );

		$this->indexable          = new Indexable_Mock();
		$this->context            = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->context->indexable = $this->indexable;
	}

	/**
	 * Tests the image id set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 *
	 * @return void
	 */
	public function test_generate_with_image_id_from_indexable() {
		$this->indexable->twitter_image_id = 1337;

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 *
	 * @return void
	 */
	public function test_generate_with_image_url_from_indexable() {
		$this->indexable->twitter_image = 'image.jpg';

		$this->image_container
			->expects( 'add_image_by_url' )
			->once()
			->with( 'image.jpg' );

		$this->instance->generate( $this->context );
	}
}
