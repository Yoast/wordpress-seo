<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Slug_Stopwords_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Admin
	 */
	private $class_instance;

	/**
	 *  Setting up an instance of the WPSEO_Admin
	 */
	public function setUp() {
		parent::setUp();

		// Set the post status to publish.
		$_POST['post_status'] = 'publish';

		$this->class_instance = new WPSEO_Admin();
	}

	/**
	 * Test with an filled slug, this is the case when the slug is already filled (manually or when editing the post)
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_with_filled_slug() {
		$this->assertEquals( 'this-slug-is-filled', $this->class_instance->filter_stopwords_from_slug( 'this-slug-is-filled', '' ) );
	}

	/**
	 * Test with an  empty slug, but with a filled title, the title will be used to set a new slug
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_with_empty_slug_post_title_filled() {
		$this->assertEquals( 'this-slug-is-filled', $this->class_instance->filter_stopwords_from_slug( '', 'this slug is filled' ) );
	}

	/**
	 * Test with an empty slug, but with a filled title, the title will be used to set a new slug, but the post_title is after filtering
	 * too short (smaller than 3 words) to use as a slug, thus the full one will be used.
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_with_short_post_title() {
		$this->assertEquals( 'is-this-slug', $this->class_instance->filter_stopwords_from_slug( '', 'is this slug' ) );
	}

	/**
	 * Test with an empty slug, but with a filled title. The slug will contain exactly three words (no stopwords) after filtering
	 * the stopwords.
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_without_stopwords_in_post_title() {
		$this->assertEquals( 'post-without-stopwords', $this->class_instance->filter_stopwords_from_slug( '', 'this post is without stopwords ' ) );
	}

	/**
	 * Test with an empty slug, but with a filled title. A longer title is used to generate a longer slug.
	 * the stopwords.
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_longer_slug_after_filtering() {
		$this->assertEquals( 'morning-will-eat-lot-eggs-without-sugar', $this->class_instance->filter_stopwords_from_slug( '', 'In the morning I will eat a lot of eggs without sugar on it.' ) );
	}

	/**
	 * Test with a filled slug and with a filled title. The result should be the use of the given slug.
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_with_title_and_slug() {
		$this->assertEquals( 'morning-will-eat-lot-eggs-with-vinegar', $this->class_instance->filter_stopwords_from_slug( 'morning-will-eat-lot-eggs-with-vinegar', 'In the morning I will eat a lot of eggs without sugar on it.' ) );
	}
	/**
	 * Test for draft status with an empty slug and with a filled title. The result should be the use of the empty slug.
	 *
	 * @covers WPSEO_Admin::filter_stopwords_from_slug
	 */
	public function test_with_title_and_slug_on_draft() {
		$_POST['post_status'] = 'draft';

		$this->assertEquals( '', $this->class_instance->filter_stopwords_from_slug( '', 'The title is useless, because it is a draft.' ) );
	}

}
