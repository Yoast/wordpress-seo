<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Yoast\WP\Free\Presenters\Abstract_Meta_Description_Presenter;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Description_Presenter;
use Yoast\WP\Free\Tests\Doubles\Presenters\Abstract_Twitter_Description_Presenter_Double;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Abstract_Twitter_Description_Presenter
 *
 * @group twitter
 * @group twitter-description
 */
class Abstract_Twitter_Description_Presenter_Test extends TestCase {

	/**
	 * @var Abstract_Twitter_Description_Presenter|Mockery\MockInterface
	 */
	private $meta_description_presenter_mock;

	/**
	 * @var Abstract_Twitter_Description_Presenter_Double|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets the mock objects to test against.
	 */
	public function setUp() {
		$this->meta_description_presenter_mock = Mockery::mock( Abstract_Meta_Description_Presenter::class )
			->shouldAllowMockingMethod( 'generate' );

		$this->instance = Mockery::mock(
			Abstract_Twitter_Description_Presenter_Double::class,
			[ $this->meta_description_presenter_mock ]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		return parent::setUp();
	}

	/**
	 * Tests the presentation of a relative image.
	 *
	 * @covers ::present
	 * @covers ::filter
	 * @covers ::replace_vars
	 * @covers ::get_replace_vars_object
	 */
	public function test_present() {
		$twitter_description = 'This is the twitter description';
		$indexable           = new Indexable();

		$this->instance
			->expects( 'generate' )
			->with( $indexable )
			->once()
			->andReturn( $twitter_description );

		// Just let the replace_vars_helper return the value it receivers
		$this->instance
			->shouldReceive( 'replace_vars' )
			->once()
			->with( $twitter_description, $indexable )
			->andReturn( $twitter_description );

		$this->assertEquals(
			'<meta name="twitter:description" content="' . $twitter_description . '" />',
			$this->instance->present( $indexable )
		);
	}

	/**
	 * Tests the presentation of a relative image.
	 *
	 * @covers ::present
	 * @covers ::filter
	 * @covers ::replace_vars
	 * @covers ::get_replace_vars_object
	 */
	public function test_present_with_empty_twitter_description_generated() {
		$twitter_description = '';
		$indexable           = new Indexable();

		$this->instance
			->expects( 'generate' )
			->with( $indexable )
			->once()
			->andReturn( $twitter_description );

		// Just let the replace_vars_helper return the value it receivers
		$this->instance
			->expects( 'replace_vars' )
			->once()
			->with( $twitter_description, $indexable )
			->andReturn( $twitter_description );

		$this->assertEquals(
			'',
			$this->instance->present( $indexable )
		);
	}

	/**
	 * Tests retrieval of the meta description.
	 *
	 * @covers ::get_meta_description
	 */
	public function test_get_meta_description() {
		$meta_description = 'This is the twitter description';
		$indexable        = new Indexable();

		$this->meta_description_presenter_mock
			->expects( 'generate' )
			->once()
			->with( $indexable )
			->andReturn( $meta_description );

		$this->assertEquals( $meta_description, $this->instance->get_meta_description( $indexable ) );
	}
}
