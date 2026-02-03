<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Title_Adapter;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Title_Adapter;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Title_Adapter tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Title_Adapter_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Title_Adapter
	 */
	protected $instance;

	/**
	 * Holds the default tagline runner.
	 *
	 * @var Mockery\MockInterface|Default_Tagline_Runner
	 */
	protected $default_tagline_runner;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->default_tagline_runner = Mockery::mock( Default_Tagline_Runner::class );

		$this->instance = new Title_Adapter(
			$this->default_tagline_runner
		);
	}
}
