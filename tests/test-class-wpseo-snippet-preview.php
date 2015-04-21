<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Snippet_Preview_Test extends WPSEO_UnitTestCase {

	private $title = 'some title';
	private $description = 'some description';

	private $post;
	private $date;
	private $url;

	public function test_get_content_GIVEN_a_regular_post() {
		$this->post = $this->factory->post->create_and_get( array( 'post_title' => $this->title ) );
		$this->date = $this->post->date;
		$this->url  = str_replace( 'http://', '', get_bloginfo( 'url' ) ) . '/';

		$expected        = <<<HTML
<div id="wpseosnippet">
<a class="title" id="wpseosnippet_title" href="#">some title</a>
<span class="url">{$this->url}some-title</span>
<p class="desc">$this->date<span class="autogen"></span><span class="content">some description</span></p>
</div>
HTML;
		$snippet_preview = new WPSEO_Snippet_Preview( $this->post, $this->title, $this->description );
		$this->assertEquals( $expected, $snippet_preview->get_content() );
	}

	public function test_get_content_GIVEN_a_post_that_is_frontpage() {
		$this->post = $this->factory->post->create_and_get( array( 'post_title' => $this->title ) );
		$this->date = $this->post->date;
		$this->url  = str_replace( 'http://', '', get_bloginfo( 'url' ) ) . '/';

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $this->post->ID );

		$expected        = <<<HTML
<div id="wpseosnippet">
<a class="title" id="wpseosnippet_title" href="#">some title</a>
<span class="url">$this->url</span>
<p class="desc">$this->date<span class="autogen"></span><span class="content">some description</span></p>
</div>
HTML;
		$snippet_preview = new WPSEO_Snippet_Preview( $this->post, $this->title, $this->description );
		$this->assertEquals( $expected, $snippet_preview->get_content() );
	}
}