<?php

namespace Yoast\WP\SEO\Tests\Unit\Exceptions\Indexable;

use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Invalid_Term_Exception_Test
 *
 * @group exceptions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception
 */
final class Invalid_Term_Exception_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->stubTranslationFunctions();

		$instance = new Invalid_Term_Exception( 'A WordPress reason.' );

		self::assertEquals(
			'The term is considered invalid. The following reason was given by WordPress: A WordPress reason.',
			$instance->getMessage()
		);
	}
}
