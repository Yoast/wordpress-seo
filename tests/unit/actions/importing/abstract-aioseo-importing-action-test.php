<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Importing_Action;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Aioseo_Importing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Importing_Action
 */
class Abstract_Aioseo_Importing_Action_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Mockery\MockInterface|Abstract_Aioseo_Importing_Action
	 */
	protected $mock_instance;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Import_Cursor_Helper
	 */
	protected $import_cursor;

	/**
	 * The sanitization helper.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	protected $sanitization;

	/**
	 * The replacevar handler.
	 *
	 * @var Mockery\MockInterface|Aioseo_Replacevar_Service
	 */
	protected $replacevar_handler;

	/**
	 * The robots provider service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The robots transformer service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Transformer_Service
	 */
	protected $robots_transformer;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->import_cursor      = Mockery::mock( Import_Cursor_Helper::class );
		$this->options            = Mockery::mock( Options_Helper::class );
		$this->sanitization       = Mockery::mock( Sanitization_Helper::class );
		$this->replacevar_handler = Mockery::mock( Aioseo_Replacevar_Service::class );
		$this->robots_provider    = Mockery::mock( Aioseo_Robots_Provider_Service::class );
		$this->robots_transformer = Mockery::mock( Aioseo_Robots_Transformer_Service::class );
		$this->mock_instance      = Mockery::mock(
			Abstract_Aioseo_Importing_Action::class,
			[ $this->import_cursor, $this->options, $this->sanitization, $this->replacevar_handler, $this->robots_provider, $this->robots_transformer ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the getting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => true,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertSame( true, $completed );
	}

	/**
	 * Tests the getting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => false,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertSame( false, $completed );
	}

	/**
	 * Tests the setting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => false,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( false );
	}

	/**
	 * Tests the setting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => true,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( true );
	}
}
