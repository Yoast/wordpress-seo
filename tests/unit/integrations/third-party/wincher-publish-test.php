<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Account_Action;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action;
use Yoast\WP\SEO\Conditionals\Wincher_Automatically_Track_Conditional;
use Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional;
use Yoast\WP\SEO\Conditionals\Wincher_Token_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\Wincher_Publish;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Publish_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Wincher_Publish
 *
 * @group integrations
 * @group front-end
 * @group woocommerce
 */
class Wincher_Publish_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Wincher_Publish
	 */
	private $instance;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The Wincher_Enabled_Conditional mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Wincher_Enabled_Conditional
	 */
	private $wincher_enabled;

	/**
	 * The keyphrases action mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Wincher_Keyphrases_Action
	 */
	private $keyphrases_action;

	/**
	 * The account action mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Wincher_Account_Action
	 */
	private $account_action;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper    = Mockery::mock( Options_Helper::class );
		$this->wincher_enabled   = Mockery::mock( Wincher_Enabled_Conditional::class );
		$this->keyphrases_action = Mockery::mock( Wincher_Keyphrases_Action::class );
		$this->account_action    = Mockery::mock( Wincher_Account_Action::class );

		$this->instance = Mockery::mock(
			Wincher_Publish::class,
			[
				$this->wincher_enabled,
				$this->options_helper,
				$this->keyphrases_action,
				$this->account_action,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Wincher_Enabled_Conditional::class,
				Wincher_Automatically_Track_Conditional::class,
				Wincher_Token_Conditional::class,
			],
			Wincher_Publish::get_conditionals()
		);
	}

	/**
	 * Tests if the constructor sets the right properties.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = new Wincher_Publish(
			$this->wincher_enabled,
			$this->options_helper,
			$this->keyphrases_action,
			$this->account_action
		);

		$this->assertInstanceOf(
			Wincher_Enabled_Conditional::class,
			$this->getPropertyValue( $instance, 'wincher_enabled' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options_helper' )
		);

		$this->assertInstanceOf(
			Wincher_Keyphrases_Action::class,
			$this->getPropertyValue( $instance, 'keyphrases_action' )
		);

		$this->assertInstanceOf(
			Wincher_Account_Action::class,
			$this->getPropertyValue( $instance, 'account_action' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'rest_after_insert_post', [ $this->instance, 'track_after_rest_api_request' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp_insert_post', [ $this->instance, 'track_after_post_request' ] ) );
	}

	/**
	 * Tests the track request function.
	 *
	 * @covers ::track_request
	 */
	public function test_track_request() {
		$post = Mockery::mock( WP_Post::class );

		$this->keyphrases_action
			->expects( 'collect_keyphrases_from_post' )
			->with( $post )
			->andReturn(
				[
					'yoast seo',
					'blog seo',
					'wincher',
				]
			);

		$this->account_action
			->expects( 'check_limit' )
			->once()
			->andReturn(
				(object) [
					'canTrack' => true,
					'limit'    => 100,
					'usage'    => 10,
					'status'   => 200,
				]
			);

		$this->keyphrases_action->expects( 'track_keyphrases' )->once();

		$this->instance->track_request( $post );
	}

	/**
	 * Tests the track request function without keyphrases.
	 *
	 * @covers ::track_request
	 */
	public function test_track_request_without_keyphrases() {
		$post = Mockery::mock( WP_Post::class );

		$this->keyphrases_action
			->expects( 'collect_keyphrases_from_post' )
			->with( $post )
			->andReturn( [] );

		$this->account_action
			->expects( 'check_limit' )
			->never();

		$this->keyphrases_action
			->expects( 'track_keyphrases' )
			->never();

		$this->instance->track_request( $post );
	}

	/**
	 * Tests the track request function when an invalid post instance is passed.
	 *
	 * @covers ::track_request
	 */
	public function test_track_request_with_invalid_post_instance() {
		$this->keyphrases_action
			->expects( 'collect_keyphrases_from_post' )
			->with( (object) [] )
			->never();

		$this->account_action
			->expects( 'check_limit' )
			->never();

		$this->keyphrases_action
			->expects( 'track_keyphrases' )
			->never();

		$this->instance->track_request( (object) [] );
	}

	/**
	 * Tests the track request after REST API request.
	 *
	 * @covers ::track_after_rest_api_request
	 */
	public function test_track_after_rest_api_request() {
		$post = Mockery::mock( WP_Post::class );

		$this->instance
			->expects( 'track_request' )
			->once()
			->with( $post );

		$this->instance->track_after_rest_api_request( $post );
	}

	/**
	 * Tests the track request after the POST request.
	 *
	 * @covers ::track_after_post_request
	 */
	public function test_track_after_post_request() {
		$post = Mockery::mock( WP_Post::class );

		$this->instance
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'track_request' )
			->once()
			->with( $post );

		$this->instance->track_after_post_request( 123, $post );
	}

	/**
	 * Tests the track request doesn't execute after the POST request when it's in combination with a REST request.
	 *
	 * @covers ::track_after_post_request
	 */
	public function test_track_after_post_request_during_rest_request() {
		$post = Mockery::mock( WP_Post::class );

		$this->instance
			->expects( 'is_rest_request' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'track_request' )
			->never();

		$this->instance->track_after_post_request( 123, $post );
	}
}
