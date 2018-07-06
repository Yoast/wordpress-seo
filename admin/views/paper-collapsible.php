<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @var string $paper_id
 * @var bool   $collapsible
 * @var array  $collapsible_config
 * @var string $title
 * @var string $title_after
 * @var string $help_text
 * @var string $view_file
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}
?>
<div class="paper tab-block" id="<?php echo esc_attr( $paper_id ); ?>">

	<?php
	if ( ! empty( $collapsible ) ) {
		printf(
			'<h2 id="%1$s"><button type="button" class="toggleable-container-trigger" aria-expanded="%4$s">%2$s <span class="toggleable-container-icon dashicons %3$s" aria-hidden="true"></span></button></h2>',
			esc_attr( $title ),
			esc_html( $title ) . $title_after . $help_text,
			$collapsible_config['toggle_icon'],
			$collapsible_config['expanded']
		);
	}
	else {
		printf( '<h2>' . esc_html( $title ) . $title_after . $help_text . '</h2>' );
	}

	?>
	<div class="<?php echo esc_attr( $collapsible_config['class'] ); ?>">
		<?php require $view_file; ?>
	</div>


</div>
