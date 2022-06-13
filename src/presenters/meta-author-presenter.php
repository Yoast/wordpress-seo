<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Presenter class for the meta author tag.
 */
class Meta_Author_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'author';

	/**
	 * Returns the author for a post in a meta author tag.
	 *
	 * @return string The meta author tag.
	 */
	public function present() {
		$output = parent::present();

		if ( ! empty( $output ) ) {
			return $output;
		}

		return '';
	}

	/**
	 * Get the author's display name.
	 *
	 * @return string The author's display name.
	 */
	public function get() {
		$user_data = \get_userdata( $this->presentation->context->post->post_author );

		return \trim( $this->helpers->schema->html->smart_strip_tags( $user_data->display_name ) );
	}
}
