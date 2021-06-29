<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Abstract presenter class for indexable tag presentations.
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 */
abstract class Abstract_Indexable_Tag_Presenter extends Abstract_Indexable_Presenter {

	const META_PROPERTY_CONTENT = '<meta property="%2$s" content="%1$s" />';
	const META_NAME_CONTENT     = '<meta name="%2$s" content="%1$s" />';
	const LINK_REL_HREF         = '<link rel="%2$s" href="%1$s" />';
	const DEFAULT_TAG_FORMAT    = self::META_NAME_CONTENT;

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
	 *
	 * @throws \InvalidArgumentException When a subclass does not define a key property. This should appear during development.
	 */
	public function present() {
		if ( $this->key === 'NO KEY PROVIDED' ) {
			throw new \InvalidArgumentException( \get_class( $this ) . ' is an Abstract_Indexable_Tag_Presenter but does not override the key property.' );
		}

		$value = $this->get();

		if ( \is_string( $value ) && $value !== '' ) {
			return \sprintf( $this->tag_format, $this->escape( $value ), $this->key );
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
