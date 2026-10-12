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
	 * @covers ::get_object_description
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
		$this->assertSame( 'post #123', $instance->get_object_description() );
		$this->assertSame(
			'Yoast SEO could not build the indexable for post #123: The underlying error.',
			$instance->getMessage(),
		);
	}

	/**
	 * Tests that an id-less object with a sub type is described by its type and sub type.
	 *
	 * @covers ::__construct
	 * @covers ::get_object_description
	 *
	 * @return void
	 */
	public function test_object_description_without_object_id() {
		$this->stubTranslationFunctions();

		$instance = new Indexing_Failed_Exception( null, 'system-page', '404', new Exception( 'The underlying error.' ) );

		$this->assertSame( 'system-page (404)', $instance->get_object_description() );
		$this->assertSame(
			'Yoast SEO could not build the indexable for system-page (404): The underlying error.',
			$instance->getMessage(),
		);
	}

	/**
	 * Tests that an id-less object without a sub type is described by its bare object type.
	 *
	 * @covers ::__construct
	 * @covers ::get_object_description
	 *
	 * @return void
	 */
	public function test_object_description_without_object_id_and_sub_type() {
		$this->stubTranslationFunctions();

		$instance = new Indexing_Failed_Exception( null, 'date-archive', null, new Exception( 'The underlying error.' ) );

		$this->assertSame( 'date-archive', $instance->get_object_description() );
		$this->assertSame(
			'Yoast SEO could not build the indexable for date-archive: The underlying error.',
			$instance->getMessage(),
		);
	}
}
