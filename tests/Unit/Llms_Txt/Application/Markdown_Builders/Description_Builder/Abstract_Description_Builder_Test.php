<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Description_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Description_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Description Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Description_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Description_Builder
	 */
	protected $instance;

	/**
	 * Holds the description adapter.
	 *
	 * @var Mockery\MockInterface|Description_Adapter
	 */
	protected $description_adapter;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->description_adapter = Mockery::mock( Description_Adapter::class );

		$this->instance = new Description_Builder(
			$this->description_adapter
		);
	}
}
