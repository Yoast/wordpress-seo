<?php
if ( ! class_exists( 'WPSEO_Snippet_Preview' ) ) {
	/**
	 * class WPSEO_Snippet_Preview
	 *
	 * Generates a Google Search snippet preview
	 *
	 * Takes a $post, $title and $description
	 *
	 */
	class WPSEO_Snippet_Preview {

		public $content;

		protected $options;
		protected $post;

		protected $date;
		protected $title;
		protected $description;
		protected $url;

		public function __construct( $post, $title, $description ) {
			$this->options     = WPSEO_Options::get_all();
			$this->post        = $post;
			$this->title       = esc_html( $title );
			$this->description = esc_html( $description );

			$this->set_date();
			$this->set_url();
			$this->set_content();
		}

		/**
		 * Set date if available
		 */
		protected function set_date() {
			$date = '';
			if ( is_object( $this->post ) && isset( $this->options['showdate-' . $this->post->post_type] ) && $this->options['showdate-' . $this->post->post_type] === true ) {
				$date = $this->get_post_date( $this->post );
			}

			if ( is_string( $date ) && $date !== '' ) {
				$this->date = '<span class="date">' . $date . ' - </span>';
			} else {
				$this->date = '';
			}
		}

		/**
		 * Retrieve a post date when post is published, or return current date when it's not.
		 *
		 * @param object $post Post to retrieve the date for.
		 *
		 * @return string
		 */
		protected function get_post_date( $post ) {
			if ( isset( $this->post->post_date ) && $this->post->post_status == 'publish' ) {
				$date = date_i18n( 'j M Y', strtotime( $this->post->post_date ) );
			} else {
				$date = date_i18n( 'j M Y' );
			}

			return (string) $date;
		}

		/**
		 * generate the url that is displayed in the snippet preview
		 */
		protected function set_url() {
			$url = str_replace( 'http://', '', get_bloginfo( 'url' ) );

			if ( is_object( $this->post ) && isset( $this->post->post_name ) && $this->post->post_name !== '' ) {
				$slug = sanitize_title( $this->title );
				$url .= '/' . esc_html( $slug );
			}

			$this->url = $url;
		}

		/**
		 * Generate the html for the snippet preview and assign it to $this->content
		 */
		protected function set_content() {

			$content = <<<HTML
<div id="wpseosnippet">
<a class="title" id="wpseosnippet_title" href="#">$this->title</a>
<span class="url">$this->url</span>
<p class="desc">$this->date<span class="autogen"></span><span class="content">$this->description</span></p>
</div>
HTML;

			$this->content = apply_filters( 'wpseo_snippet', $content, $this->post, compact( 'title', 'desc', 'date', 'slug' ) );
		}

	}
}