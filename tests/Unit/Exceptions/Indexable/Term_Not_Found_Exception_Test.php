<?php

namespace Yoast\WP\SEO\Tests\Unit\Exceptions\Indexable;

use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Term_Not_Found_Exception_Test
 *
 * @group exceptions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception
 */
final class Term_Not_Found_Exception_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->stubTranslationFunctions();

		$instance = new Term_Not_Found_Exception();

		self::assertEquals(
			'The term could not be found.',
			$instance->getMessage()
		);
	}
}
