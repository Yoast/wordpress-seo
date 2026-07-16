<?php

namespace Yoast\WP\SEO\Tests\Unit\Exceptions\Indexable;

use Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Indexing_Failed_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Failed_Exception_Test
 *
 * @group exceptions
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Exceptions\Indexable\Indexing_Failed_Exception
 */
final class Indexing_Failed_Exception_Test extends TestCase {

	/**
	 * Tests that the exception carries the failing object and wraps the original error.
	 *
	 * @covers ::__construct
	 * @covers ::get_object_id
	 * @covers ::get_object_type
	 * @covers ::get_object_sub_type
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->stubTranslationFunctions();

		$previous = new Exception( 'The underlying error.' );

		$instance = new Indexing_Failed_Exception( 123, 'post', 'page', $previous );

		$this->assertSame( 123, $instance->get_object_id() );
		$this->assertSame( 'post', $instance->get_object_type() );
		$this->assertSame( 'page', $instance->get_object_sub_type() );
		$this->assertSame( $previous, $instance->getPrevious() );
		$this->assertSame(
			'Yoast SEO could not build the post indexable for object 123: The underlying error.',
			$instance->getMessage(),
		);
	}
}
