<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Helpers\Indexable_Helper;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;

/**
 * Indexable_Helper test.
 */
class Indexable_Helper_Test extends TestCase {

	/**
	 * Options_Helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Environment_Helper mock.
	 *
	 * @var Mockery\MockInterface|Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Indexing_Helper mock.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Instance under test.
	 *
	 * @var Indexable_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();
		$this->options_helper     = Mockery::mock( Options_Helper::class );
		$this->environment_helper = Mockery::mock( Environment_Helper::class );
		$this->indexing_helper    = Mockery::mock( Indexing_Helper::class );
		$this->instance           = new Indexable_Helper(
			$this->options_helper,
			$this->environment_helper,
			$this->indexing_helper
		);
	}
}
