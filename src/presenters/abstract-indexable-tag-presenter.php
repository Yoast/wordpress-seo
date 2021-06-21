<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Abstract presenter class for indexable tag presentations.
 */
abstract class Abstract_Indexable_Tag_Presenter extends Abstract_Indexable_Presenter {

	const META_NAME_CONTENT     = '<meta name="%$2s" content="%$1s" />';
	const META_PROPERTY_CONTENT = '<meta property="%$2s" content="%$1s" />';
	const LINK_REL_HREF         = '<link rel="%$2s" href="%$1s" />';
	const DEFAULT_TAG_FORMAT    = self::META_NAME_CONTENT;

	const KEY = 'NO KEY PROVIDED';

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = self::DEFAULT_TAG_FORMAT;

	/**
	 * The method of escaping to use.
	 *
	 * @var string
	 */
	protected $escaping = 'attribute';

	/**
	 * Returns a tag in the head.
	 *
	 * @return string The tag.
	 */
	public function present() {
		if ( $this::KEY === 'NO KEY PROVIDED' ) {
			echo \get_class( $this ) . ' is an Abstract_Indexable_Tag_Presenter but does not provide a KEY constant.';
			die;
		}

		$value = $this->get();

		if ( \is_string( $value ) && $value !== '' ) {
			return \sprintf( $this->tag_format, $this->escape( $value ), $this::KEY );
		}

		return '';
	}

	/**
	 * Escaped the output.
	 *
	 * @param string $value The desired method of escaping; 'html', 'url' or 'attribute'.
	 *
	 * @return string The escaped value.
	 */
	protected function escape( $value ) {
		switch ( $this->escaping ) {
			case 'html':
				return \esc_html( $value );
			case 'url':
				return \esc_url( $value );
			case 'attribute':
			default:
				return \esc_attr( $value );
		}
	}
}
