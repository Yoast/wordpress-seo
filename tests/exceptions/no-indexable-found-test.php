<?php

namespace Yoast\WP\Free\Tests\Exceptions;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group exceptions
 *
 * @package Yoast\Tests\Exceptions
 */
class No_Indexable_Found_Test extends TestCase {

	/**
	 * Sets up the test fixtures for each test.
	 */
	public function setUp() {

		parent::setUp();

		$logger = $this
			->getMockBuilder( '\YoastSEO_Vendor\Psr\Log\AbstractLogger' )
			->setMethods( array( 'notice', 'log' ) )
			->getMockForAbstractClass();

		$logger
			->expects( $this->once() )
			->method( 'notice' );

		Logger::set_logger( $logger );
	}

	/**
	 * Cleans up after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		Logger::set_logger();
	}

	/**
	 * Tests the exception for a non existing post.
	 *
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::from_post_id()
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::create_and_log_exception()
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found For test purposes.
	 */
	public function test_from_post_id() {
		try {
			throw No_Indexable_Found::from_post_id( 1 );
		}
		catch ( No_Indexable_Found $e ) {
			$this->assertSame(
				'There is no indexable found for post id 1.',
				$e->getMessage()
			);
		}
	}

	/**
	 * Tests the exception for a non existing term.
	 *
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::from_term_id()
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::create_and_log_exception()
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found For test purposes.
	 */
	public function test_from_term_id() {
		try {
			throw No_Indexable_Found::from_term_id( 1, 'category' );
		}
		catch ( No_Indexable_Found $e ) {
			$this->assertSame(
				'There is no indexable found for term id 1 and taxonomy category.',
				$e->getMessage()
			);
		}
	}

	/**
	 * Tests the exception for a non existing term.
	 *
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::from_primary_term()
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::create_and_log_exception()
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found For test purposes.
	 */
	public function test_from_primary_term() {
		try {
			throw No_Indexable_Found::from_primary_term( 1, 'category' );
		}
		catch ( No_Indexable_Found $e ) {
			$this->assertSame(
				'There is no primary term found for post id 1 and taxonomy category.',
				$e->getMessage()
			);
		}
	}

	/**
	 * Tests the exception for a non existing post.
	 *
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::from_author_id()
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::create_and_log_exception()
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found For test purposes.
	 */
	public function test_from_author_id() {
		try {
			throw No_Indexable_Found::from_author_id( 1 );
		}
		catch ( No_Indexable_Found $e ) {
			$this->assertSame(
				'There is no indexable found for author id 1.',
				$e->getMessage()
			);
		}
	}

	/**
	 * Tests the exception for a non existing indexable meta.
	 *
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::from_meta_key()
	 * @covers \Yoast\WP\Free\Exceptions\No_Indexable_Found::create_and_log_exception()
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found For test purposes.
	 */
	public function test_from_meta_key() {
		try {
			throw No_Indexable_Found::from_meta_key( 'name', 1 );
		}
		catch ( No_Indexable_Found $e ) {
			$this->assertSame(
				'There is no meta found for indexable id 1 and meta key name.',
				$e->getMessage()
			);
		}
	}

	/**
	 * Overrides the logger. To make the loggin 'testable'.
	 *
	 * @return \YoastSEO_Vendor\Psr\Log\LoggerInterface The 'logger'.
	 */
	public function get_logger() {
		$logger = $this
			->getMockBuilder( '\YoastSEO_Vendor\Psr\Log\AbstractLogger' )
			->setMethods( array( 'notice' ) )
			->getMockForAbstractClass();

		$logger
			->expects( $this->once() )
			->method( 'notice' );

		return $logger;
	}
}
