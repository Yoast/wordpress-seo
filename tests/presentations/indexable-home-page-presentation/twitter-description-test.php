<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation
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
	 * @var Indexable_Home_Page_Presentation
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->option_helper = Mockery::mock( Options_Helper::class );
		$this->indexable     = new Indexable();

		$presentation   = new Indexable_Home_Page_Presentation( $this->option_helper );
		$this->instance = $presentation->of( $this->indexable );

		return parent::setUp();
	}

	/**
	 * Tests the situation where the twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_set_twitter_description() {
		$this->indexable->twitter_image = 'Twitter description';

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_image() );
	}
}
