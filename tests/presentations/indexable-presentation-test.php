<?php
namespace Yoast\WP\Free\Tests\Presentations;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Tests\Doubles\Presentations\Indexable_Presentation_Double;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Indexable_Presentation_Test extends TestCase {

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Presentation_Double|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->indexable      = new Indexable();
		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->image_helper   = Mockery::mock( Image_Helper::class );
		$current_page_helper  = Mockery::mock( Current_Page_Helper::class );
		$robots_helper        = Mockery::mock( Robots_Helper::class );

		$instance = Mockery::mock( Indexable_Presentation_Double::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance = $instance->of( $this->indexable );
		$this->instance->set_helpers(
			$robots_helper,
			$this->image_helper,
			$this->options_helper,
			$current_page_helper
		);

		parent::setUp();
	}

	/**
	 * @covers ::get_attachment_url_by_id
	 */
	public function test_get_attachment_url_by_id_with_overridden_image_size() {
		\Brain\Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( 500 );

		$this->image_helper
			->expects( 'get_image' )
			->once()
			->with( 1337, 500 )
			->andReturn( 'image.jpg' );

		$this->assertEquals( 'image.jpg', $this->instance->get_attachment_url_by_id( 1337 ) );
	}

	/**
	 * @covers ::get_attachment_url_by_id
	 */
	public function test_get_attachment_url_by_id_with_attachment_variations() {
		\Brain\Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( null );

		$this->image_helper
			->expects( 'get_attachment_variations' )
			->once()
			->with(
				1337,
				[
					'min_width'  => 200,
					'max_width'  => 2000,
					'min_height' => 200,
					'max_height' => 2000,
				]
			)
			->andReturn( 'image.jpg' );

		$this->assertEquals( 'image.jpg', $this->instance->get_attachment_url_by_id( 1337 ) );
	}

	/**
	 * @covers ::get_default_og_image
	 */
	public function test_get_default_og_image_with_opengraph_disabled() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'opengraph' )
			->andReturnFalse();

		$this->assertEmpty( $this->instance->get_default_og_image() );
	}
	/**
	 * @covers ::get_default_og_image
	 */
	public function test_get_default_og_image_with_default_image_id() {
		$this->options_helper
			->expects( 'get' )
			->times( 2 )
			->andReturn( true, 1337 );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->with( 1337 )
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->instance->get_default_og_image() );
	}

	/**
	 * @covers ::get_default_og_image
	 */
	public function test_get_default_og_image_with_default_image() {
		$this->options_helper
			->expects( 'get' )
			->times( 3 )
			->andReturn( true, false, 'default_image.jpg' );

		$this->assertEquals( 'default_image.jpg', $this->instance->get_default_og_image() );
	}
	/**
	 * @covers ::get_default_og_image
	 */
	public function test_get_default_og_image_with_no_default_image() {
		$this->options_helper
			->expects( 'get' )
			->times( 3 )
			->andReturn( true, false, false );

		$this->assertEmpty( $this->instance->get_default_og_image() );
	}



}
