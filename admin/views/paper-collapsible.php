<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses string                 $paper_id           The ID of the paper.
 * @uses bool                   $collapsible        Whether the collapsible should be rendered.
 * @uses array                  $collapsible_config Configuration for the collapsible.
 * @uses string                 $title              The title.
 * @uses string                 $title_after        Additional content to render after the title.
 * @uses string                 $view_file          Path to the view file.
 * @uses WPSEO_Admin_Help_Panel $help_text          The help text.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>
<div class="<?php echo esc_attr( 'paper tab-block ' . $class ); ?>"<?php echo ( $paper_id ) ? ' id="' . esc_attr( 'wpseo-' . $paper_id ) . '"' : ''; ?>>

	<?php
	if ( ! empty( $title ) ) {
		if ( ! empty( $collapsible ) ) {

			$button_id_attr = '';
			if ( ! empty( $paper_id ) ) {
				$button_id_attr = sprintf( ' id="%s"', esc_attr( 'wpseo-' . $paper_id . '-button' ) );
			}

			printf(
				'<h2 class="collapsible-header"><button%4$s type="button" class="toggleable-container-trigger" aria-expanded="%3$s">%1$s <span class="toggleable-container-icon dashicons %2$s" aria-hidden="true"></span></button></h2>',
				esc_html( $title ) . $title_after . $help_text->get_button_html(),
				$collapsible_config['toggle_icon'],
				$collapsible_config['expanded'],
				$button_id_attr
			);
		}
		else {
			printf( '<div class="paper-title"><h2 class="help-button-inline">' . esc_html( $title ) . $title_after . $help_text->get_button_html() . '</h2></div>' );
		}
	}
	?>
	<?php

	echo $help_text->get_panel_html();

	$container_id_attr = '';
	if ( ! empty( $paper_id ) ) {
		$container_id_attr = sprintf( ' id="%s"', esc_attr( 'wpseo-' . $paper_id . '-container' ) );
	}

	printf(
		'<div%1$s class="%2$s">%3$s</div>',
		$container_id_attr,
		esc_attr( 'paper-container ' . $collapsible_config['class'] ),
		$content
	);
	?>

</div>
