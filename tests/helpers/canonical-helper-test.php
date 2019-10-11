<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Brain\Monkey;
use Yoast\WP\Free\Helpers\Canonical_Helper;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Canonical_Helper
 */
class Canonical_Helper_Test extends TestCase {

	/**
	 * @var Canonical_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Canonical_Helper();
	}

	/**
	 * Tests whether the after generate function does nothing if a absolute url is provided.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_absolute_url() {

	}

	/**
	 * Tests whether the after generate function converts a relative url to an absolute url.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_relative_url() {

	}
}
