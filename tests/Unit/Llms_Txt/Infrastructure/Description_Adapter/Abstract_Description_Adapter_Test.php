<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Description_Adapter;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Description_Adapter;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Description_Adapter tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Description_Adapter_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Description_Adapter
	 */
	protected $instance;

	/**
	 * Holds the meta surface.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	protected $meta;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta = Mockery::mock( Meta_Surface::class );

		$this->instance = new Description_Adapter(
			$this->meta
		);
	}
}
