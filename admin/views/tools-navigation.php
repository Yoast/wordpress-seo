<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

$admin_url = admin_url( 'admin.php?page=wpseo_tools' );

?>
<nav class="yoast-tabs" id="wpseo-tabs">
	<ul class="yoast-tabs__list">
		<?php

		foreach ( $tools as $slug => $tool ) {
			$href = ( isset( $tool['href'] ) ) ? $admin_url . $tool['href'] : add_query_arg( [ 'tool' => $slug ],
				$admin_url );

			$active_item = '';

			if ( $slug === $tool_page ) {
				$active_item = ' yoast-tabs__list-item--active';
			}

			if ( empty( $tool_page ) && $slug === 'general' ) {
				$active_item = ' yoast-tabs__list-item--active';
			}
			?>
			<li class="yoast-tabs__list-item<?php echo esc_attr( $active_item ) ?>">
				<a class="yoast-tabs__list-item-link" id="<?php echo esc_attr( $slug ) ?>" -tab"
				href="<?php echo esc_url( $href ) ?>"><?php echo esc_html( $tool['title'] ); ?></a>
			</li>
		<?php
		}
		?>
	</ul>
</nav>
