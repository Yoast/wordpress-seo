<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Options;

use Mockery;
use Yoast\WP\SEO\Actions\Options\Options_Action;
use Yoast\WP\SEO\Exceptions\Option\Form_Invalid_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Empty_String_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Action_Test.
 *
 * @group actions
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Options\Options_Action
 */
class Options_Action_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Options_Action
	 */
	protected $instance;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Options_Action( $this->options_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Options_Action::class, $this->instance );
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the get action simply refers to the options helper' get_options.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$keys   = [ 'foo', 'bar' ];
		$result = 'value';
		$this->options_helper->expects( 'get_options' )
			->once()
			->with( $keys )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->get( $keys ) );
	}

	/**
	 * Tests the set action refers to the options helper' set_options.
	 *
	 * @covers ::set
	 */
	public function test_set() {
		$options = [ 'foo' => 'bar' ];
		$result  = [ 'success' => true ];
		$this->options_helper->expects( 'set_options' )
			->once()
			->with( $options )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->set( $options ) );
	}

	/**
	 * Tests the set action error' exception to message.
	 *
	 * @covers ::set
	 */
	public function test_set_with_error() {
		$options = [ 'foo' => 'bar' ];
		$this->options_helper->expects( 'set_options' )
			->once()
			->with( $options )
			->andReturn(
				[
					'success' => false,
					'error'   => Save_Failed_Exception::for_option( 'foo' ),
				]
			);

		$this->assertSame(
			[
				'success' => false,
				'error'   => 'Failed to save the option (foo).',
			],
			$this->instance->set( $options )
		);
	}

	/**
	 * Tests the set action error' form exception to message.
	 *
	 * @covers ::set
	 */
	public function test_set_with_form_error() {
		$options = [ 'foo' => 'bar' ];
		$this->options_helper->expects( 'set_options' )
			->once()
			->with( $options )
			->andReturn(
				[
					'success' => false,
					'error'   => new Form_Invalid_Exception( [ 'foo' => new Invalid_Empty_String_Exception( 'bar' ) ] ),
				]
			);

		$this->assertSame(
			[
				'success'      => false,
				'error'        => 'Form contains invalid fields.',
				'field_errors' => [
					'foo' => '<strong>bar</strong> is not empty.',
				],
			],
			$this->instance->set( $options )
		);
	}
}
