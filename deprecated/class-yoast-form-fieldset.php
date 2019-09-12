<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generate the HTML for a form fieldset to wrap grouped form elements.
 */
class Yoast_Form_Fieldset implements Yoast_Form_Element {

	/**
	 * The fieldset ID.
	 *
	 * @var string
	 */
	private $id;

	/**
	 * The fieldset HTML default attributes.
	 *
	 * @var array
	 */
	private $attributes = array(
		'class' => 'yoast-form-fieldset',
	);

	/**
	 * The grouped form elements for the fieldset.
	 *
	 * @var string
	 */
	private $content;

	/**
	 * The fieldset legend HTML default attributes.
	 *
	 * @var array
	 */
	private $legend_attributes = array(
		'class' => 'yoast-form-legend',
	);

	/**
	 * A translatable string for the fieldset legend content.
	 *
	 * @var string
	 */
	private $legend_content;

	/**
	 * Constructor.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @param string $id             ID for the fieldset.
	 * @param string $legend_content The translatable legend text.
	 * @param string $content        The grouped form elements for the fieldset.
	 */
	public function __construct( $id, $legend_content, $content ) {
		_deprecated_function( __METHOD__, '11.9' );

		$this->id             = $id;
		$this->legend_content = $legend_content;
		$this->content        = $content;
	}

	/**
	 * Render the view.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 */
	public function render_view() {
		_deprecated_function( __METHOD__, '11.9' );

		/*
		 * Extract because we want values accessible via variables for later use
		 * in the view instead of accessing them as an array.
		 */
		extract( $this->get_parts() );

		require WPSEO_PATH . 'admin/views/form/fieldset.php';
	}

	/**
	 * Start output buffering to catch the form elements to wrap in the fieldset.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 */
	public function start() {
		_deprecated_function( __METHOD__, '11.9' );

		ob_start();
	}

	/**
	 * Return output buffering with the form elements to wrap in the fieldset.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 */
	public function end() {
		_deprecated_function( __METHOD__, '11.9' );

		$this->content = ob_get_clean();
	}

	/**
	 * Return the rendered view.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_html() {
		_deprecated_function( __METHOD__, '11.9' );

		ob_start();
		$this->render_view();
		return ob_get_clean();
	}

	/**
	 * Output the rendered view.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 */
	public function html() {
		_deprecated_function( __METHOD__, '11.9' );

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: This is deprecated.
		echo $this->get_html();
	}

	/**
	 * Add attributes to the fieldset default attributes.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @param array $attributes Array of attributes names and values to merge with the defaults.
	 */
	public function add_attributes( $attributes ) {
		_deprecated_function( __METHOD__, '11.9' );

		$this->attributes = wp_parse_args( $attributes, $this->attributes );
	}

	/**
	 * Add attributes to the fieldset legend default attributes.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @param array $attributes Array of attributes names and values to merge with the defaults.
	 */
	public function legend_add_attributes( $attributes ) {
		_deprecated_function( __METHOD__, '11.9' );

		$this->legend_attributes = wp_parse_args( $attributes, $this->legend_attributes );
	}

	/**
	 * Visually hide the fieldset legend but keep it available to assistive technologies.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 */
	public function legend_hide() {
		_deprecated_function( __METHOD__, '11.9' );

		$this->legend_attributes = wp_parse_args(
			array( 'class' => 'screen-reader-text' ),
			$this->legend_attributes
		);
	}

	/**
	 * Return the set of attributes and content for the fieldset.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	private function get_parts() {
		return array(
			'id'                => $this->id,
			'attributes'        => $this->get_attributes_html( $this->attributes ),
			'legend_content'    => $this->legend_content,
			'legend_attributes' => $this->get_attributes_html( $this->legend_attributes ),
			'content'           => $this->content,
		);
	}

	/**
	 * Return HTML formatted attributes as a string, when there are attributes set.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @param array $attributes Fieldset or legend attributes.
	 *
	 * @return string A space separated list of HTML formatted attributes or empty string.
	 */
	private function get_attributes_html( $attributes ) {
		if ( ! empty( $attributes ) ) {
			array_walk( $attributes, array( $this, 'parse_attribute' ) );

			// Use an initial space as `implode()` adds a space only between array elements.
			return ' ' . implode( ' ', $attributes );
		}

		return '';
	}

	/**
	 * Escape and format an attribute as an HTML attribute.
	 *
	 * @deprecated         11.9
	 * @codeCoverageIgnore
	 *
	 * @param string $value     The value of the attribute.
	 * @param string $attribute The attribute to look for.
	 */
	private function parse_attribute( & $value, $attribute ) {
		$value = sprintf( '%s="%s"', esc_html( $attribute ), esc_attr( $value ) );
	}
}
