<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Options;

use Mockery;
use Yoast\WP\SEO\Actions\Options\Network_Admin_Options_Action;
use Yoast\WP\SEO\Exceptions\Option\Form_Invalid_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Empty_String_Exception;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Network_Admin_Options_Action_Test.
 *
 * @group actions
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Options\Network_Admin_Options_Action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Network_Admin_Options_Action_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Network_Admin_Options_Action
	 */
	protected $instance;

	/**
	 * Holds the Network_Admin_Options_Service instance.
	 *
	 * @var Network_Admin_Options_Service|Mockery\MockInterface
	 */
	protected $network_admin_options_service;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->network_admin_options_service = Mockery::mock( Network_Admin_Options_Service::class );
		$this->instance                      = new Network_Admin_Options_Action( $this->network_admin_options_service );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Network_Admin_Options_Action::class, $this->instance );
		$this->assertInstanceOf(
			Network_Admin_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'network_admin_options_service' )
		);
	}

	/**
	 * Tests the get action simply refers to the network admin options service' get_options.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$keys   = [ 'foo', 'bar' ];
		$result = 'value';
		$this->network_admin_options_service->expects( 'get_options' )
			->once()
			->with( $keys )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->get( $keys ) );
	}

	/**
	 * Tests the set action refers to the network admin options service' set_options.
	 *
	 * @covers ::set
	 * @covers ::set_options
	 */
	public function test_set() {
		$options = [ 'foo' => 'bar' ];
		$result  = [ 'success' => true ];
		$this->network_admin_options_service->expects( 'set_options' )
			->once()
			->with( $options )
			->andReturn( $result );

		$this->assertSame( $result, $this->instance->set( $options ) );
	}

	/**
	 * Tests the set action error' exception to message.
	 *
	 * @covers ::set
	 * @covers ::set_options
	 */
	public function test_set_with_error() {
		$options = [ 'foo' => 'bar' ];
		$this->network_admin_options_service->expects( 'set_options' )
			->once()
			->with( $options )
			->andThrow( Save_Failed_Exception::for_option( 'foo' ) );

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
	 * @covers ::set_options
	 */
	public function test_set_with_form_error() {
		$options = [ 'foo' => 'bar' ];
		$this->network_admin_options_service->expects( 'set_options' )
			->once()
			->with( $options )
			->andThrow( new Form_Invalid_Exception( [ 'foo' => new Invalid_Empty_String_Exception( 'bar' ) ] ) );

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
