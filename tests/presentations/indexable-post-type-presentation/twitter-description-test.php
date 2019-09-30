<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Meta_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-description
 */
class Twitter_Description_Test extends TestCase {

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $option_helper;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Post_Type_Presentation
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->option_helper = Mockery::mock( Options_Helper::class );
		$meta_helper         = Mockery::mock( Meta_Helper::class );
		$current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$image_helper        = Mockery::mock( Image_Helper::class );
		$this->indexable     = new Indexable();

		$presentation   = new Indexable_Post_Type_Presentation(
			$this->option_helper,
			$meta_helper,
			$current_page_helper,
			$image_helper
		);
		$this->instance = $presentation->of( $this->indexable );

		return parent::setUp();
	}

	/**
	 * Tests the situation where the twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_set_twitter_description() {
		$this->indexable->twitter_description = 'Twitter description';

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_meta_description() {
		$this->indexable->description = 'Meta description';

		$this->assertEquals( 'Meta description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_term_description() {
		$this->option_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->once()
			->andReturn( 'The excerpt as description' );

		Monkey\Functions\expect( 'get_the_excerpt' )
			->once()
			->andReturn( 'The excerpt as description' );

		$this->assertEquals( 'The excerpt as description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_no_term_description() {
		$this->option_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'get_the_excerpt' )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_twitter_description() );
	}

}
