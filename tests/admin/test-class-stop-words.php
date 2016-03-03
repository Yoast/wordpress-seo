<?php

class WPSEO_Admin_Stop_WordsTest extends PHPUnit_Framework_TestCase {
	/**
	 * @var WPSEO_Admin_Stop_Words
	 */
	protected $subject;

	public function setUp() {
		$this->subject = new WPSEO_Admin_Stop_Words();
	}

	/**
	 * @cover WPSEO_Admin_Stop_Words:remove_in
	 */
	public function test_remove_stop_words() {
		$original = 'and-without-about-stop-blaat-words';
		$expected = 'without-stop-words';
		$subject = $this->getMock( 'WPSEO_Admin_Stop_Words', array( 'list_stop_words' ) );

		$subject
			->expects( $this->once() )
			->method( 'list_stop_words' )
			->will( $this->returnValue( array( 'and', 'about', 'blaat' ) ) );

		/* @type WPSEO_Admin_Stop_Words $subject */
		$this->assertEquals( $expected, $subject->remove_in( $original ) );
	}

	/**
	 * @cover WPSEO_Admin_Stop_Words:remove_in
	 */
	public function test_remove_stop_words_EMPTY() {
		$original = '';
		$expected = '';

		$this->assertEquals( $expected, $this->subject->remove_in( $original ) );
	}

	/**
	 * Check if list_stop_words works and throws no errors
	 */
	public function test_stop_words() {
		$stopwords = $this->subject->list_stop_words();

		$this->assertTrue( is_array( $stopwords ) );
	}
}
