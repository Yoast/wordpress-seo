<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.Invalid
namespace Yoast\WP\SEO\Schema_Templates\Assets;

/**
 * Class Icons.
 *
 * Provides SVG icons as strings.
 *
 * @deprecated 20.5
 * @codeCoverageIgnore
 */
class Icons {

	/**
	 * Represents the start of the SVG tag.
	 */
	public const SVG_START_TAG = "<svg xmlns='http://www.w3.org/2000/svg' fill='none' style='fill:none' viewBox='0 0 24 24' stroke='currentColor' height='%SIZE%' width='%SIZE%' >";

	/**
	 * The default height and width of an icon.
	 */
	public const SIZE_DEFAULT = 24;

	/**
	 * The height and width of an icon in a variation picker.
	 */
	public const SIZE_VARIATION = 36;

	/**
	 * The Heroicons academic cap svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_academic_cap( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path fill='#fff' d='M12 14l9-5-9-5-9 5 9 5z' />"
			. "<path fill='#fff' d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' />"
			. "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' />",
			$size
		);
	}

	/**
	 * The Heroicons annotation svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_annotation( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />",
			$size
		);
	}

	/**
	 * The Heroicons ban svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_ban( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' />",
			$size
		);
	}

	/**
	 * The Heroicons briefcase svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_briefcase( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />",
			$size
		);
	}

	/**
	 * The Heroicons calendar svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_calendar( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />",
			$size
		);
	}

	/**
	 * The Heroicons clipboard check svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_clipboard_check( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />",
			$size
		);
	}

	/**
	 * The Heroicons clipboard copy svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_clipboard_copy( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3' />",
			$size
		);
	}

	/**
	 * The Heroicons clipboard list svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_clipboard_list( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' />",
			$size
		);
	}

	/**
	 * The Heroicons clock svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_clock( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />",
			$size
		);
	}

	/**
	 * The Heroicons currency dollar svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_currency_dollar( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />",
			$size
		);
	}

	/**
	 * The Heroicons cursor_click svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_cursor_click( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' />",
			$size
		);
	}

	/**
	 * The Heroicons document text svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_document_text( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />",
			$size
		);
	}

	/**
	 * The Heroicons globe svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_globe( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />",
			$size
		);
	}

	/**
	 * The Heroicons identification svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_identification( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' />",
			$size
		);
	}

	/**
	 * The Heroicons location marker svg icon
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_location_marker( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />"
			. "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />",
			$size
		);
	}

	/**
	 * The Heroicons office building svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_office_building( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path d='M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 6.99998H10M9 11H10M14 6.99998H15M14 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>",
			$size
		);
	}

	/**
	 * The Heroicons photograph svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_photograph( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />",
			$size
		);
	}

	/**
	 * The Heroicons switch horizontal svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 * @return string
	 */
	public static function heroicons_switch_horizontal( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />",
			$size
		);
	}

	/**
	 * The Heroicons grid svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 *
	 * @return string The generated icon.
	 */
	public static function heroicons_grid( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />",
			$size
		);
	}

	/**
	 * The Heroicons book open svg icon.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param int $size The Height and Width of the SVG icon.
	 *
	 * @return string The generated icon.
	 */
	public static function heroicons_book_open( $size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return self::svg(
			"<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />",
			$size
		);
	}

	/**
	 * Generates the SVG based on given path.
	 *
	 * @deprecated 20.5
	 * @codeCoverageIgnore
	 *
	 * @param string $path     The path to generate svg for.
	 * @param int    $svg_size The Height and Width of the SVG icon.
	 *
	 * @return string The generated icon svg.
	 */
	protected static function svg( $path, $svg_size = self::SIZE_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		$start = \str_replace( '%SIZE%', $svg_size, self::SVG_START_TAG );
		return $start . $path . '</svg>';
	}
}
