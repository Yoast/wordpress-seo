<?php

namespace Yoast\WP\SEO\Tests\WP\Formatter;

use WPSEO_Options;
use WPSEO_Post_Metabox_Formatter;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Post_Metabox_Formatter_Test extends TestCase {

	/**
	 * The post.
	 *
	 * @var WP_Post
	 */
	private $post;

	/**
	 * Creates a post to use in the tests.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->post = $this->factory->post->create_and_get();
	}

	/**
	 * Test with a post being set but with no options being set.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_values
	 * @covers WPSEO_Post_Metabox_Formatter::get_focus_keyword_usage
	 * @covers WPSEO_Post_Metabox_Formatter::get_title_template
	 * @covers WPSEO_Post_Metabox_Formatter::get_metadesc_template
	 * @covers WPSEO_Post_Metabox_Formatter::get_template
	 *
	 * @return void
	 */
	public function test_post_with_empty_options() {
		WPSEO_Options::set( 'keyword_usage', [ '' => [] ] );
		WPSEO_Options::set( 'title-' . $this->post->post_type, '' );
		WPSEO_Options::set( 'metadesc-' . $this->post->post_type, '' );

		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( [ '' => [] ], $result['keyword_usage'] );
		$this->assertEquals( '%%title%% %%page%% %%sep%% %%sitename%%', $result['title_template'] );
		$this->assertEquals( '', $result['metadesc_template'] );
	}

	/**
	 * Testing with a post and needed options being set.
	 *
	 * @covers WPSEO_Post_Metabox_Formatter::get_metadesc_date
	 *
	 * @return void
	 */
	public function test_metabox_metadescription_date() {
		WPSEO_Options::set( 'title-post', 'This is the title' );
		WPSEO_Options::set( 'metadesc-post', 'This is the metadescription' );
		$instance = new WPSEO_Post_Metabox_Formatter( $this->post, [], '' );
		$result   = $instance->get_values();

		$this->assertEquals( $result['metaDescriptionDate'], \date_i18n( 'M j, Y', \mysql2date( 'U', $this->post->post_date ) ) );
		$this->assertEquals( $result['title_template'], 'This is the title' );
		$this->assertEquals( $result['metadesc_template'], 'This is the metadescription' );
	}
}
