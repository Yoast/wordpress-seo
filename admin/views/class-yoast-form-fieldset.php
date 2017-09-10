<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generate the HTML for a form fieldset to wrap grouped form elements.
 */
class Yoast_Form_Fieldset implements Yoast_Form_Element {

	/**
	 * @var string The fieldset ID.
	 */
	private $id;

	/**
	 * @var array The fieldset HTML default attributes.
	 */
	private $attributes = array(
		'class' => 'yoast-form-fieldset',
	);

	/**
	 * @var string The grouped form elements for the fieldset.
	 */
	private $content;

	/**
	 * @var array The fieldset legend HTML default attributes.
	 */
	private $legend_attributes = array(
		'class' => 'yoast-form-legend',
	);

	/**
	 * @var string A translatable string for the fieldset legend content.
	 */
	private $legend_content;

	/**
	 * Constructor.
	 *
	 * @param string $id             ID for the fieldset.
	 * @param string $legend_content The translatable legend text.
	 * @param string $content        The grouped form elements for the fieldset.
	 */
	public function __construct( $id, $legend_content, $content ) {
		$this->id             = $id;
		$this->legend_content = $legend_content;
		$this->content        = $content;
	}

	/**
	 * Render the view.
	 */
	public function render_view() {
		/*
		 * Extract because we want values accessible via variables for later use
		 * in the view instead of accessing them as an array.
		 */
		extract( $this->get_parts() );

		require dirname( WPSEO_FILE ) . '/admin/views/form/fieldset.php';
	}

	/**
	 * Start output buffering to catch the form elements to wrap in the fieldset.
	 */
	public function start() {
		ob_start();
	}

	/**
	 * Return output buffering with the form elements to wrap in the fieldset.
	 */
	public function end() {
		$this->content = ob_get_clean();
	}

	/**
	 * Return the rendered view.
	 *
	 * @return string
	 */
	public function get_html() {
		ob_start();
		$this->render_view();
		return ob_get_clean();
	}

	/**
	 * Output the rendered view.
	 */
	public function html() {
		echo $this->get_html();
	}

	/**
	 * Add attributes to the fieldset default attributes.
	 *
	 * @param array $attributes Array of attributes names and values to merge with the defaults.
	 */
	public function add_attributes( $attributes ) {
		$this->attributes = wp_parse_args( $attributes, $this->attributes );
	}

	/**
	 * Add attributes to the fieldset legend default attributes.
	 *
	 * @param array $attributes Array of attributes names and values to merge with the defaults.
	 */
	public function legend_add_attributes( $attributes ) {
		$this->legend_attributes = wp_parse_args( $attributes, $this->legend_attributes );
	}

	/**
	 * Visually hide the fieldset legend but keep it available to assistive technologies.
	 */
	public function legend_hide() {
		$this->legend_attributes = wp_parse_args(
			array( 'class' => 'screen-reader-text' ),
			$this->legend_attributes
		);
	}

	/**
	 * Return the set of attributes and content for the fieldset.
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
	 * @param string $value     The value of the attribute.
	 * @param string $attribute The attribute to look for.
	 */
	private function parse_attribute( & $value, $attribute ) {
		$value = sprintf( '%s="%s"', esc_html( $attribute ), esc_attr( $value ) );
	}
}
