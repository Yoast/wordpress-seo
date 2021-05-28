import {
	Dashicon,
	Dropdown,
	Toolbar,
	ToolbarButton,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore -- Is exported in Gutenberg.
	ToolbarGroup,
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { createElement, useCallback } from "react";

import HeadingLevelIcon from "./HeadingLevelIcon";

const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

const POPOVER_PROPS = {
	className: "block-library-heading-level-dropdown",
	isAlternate: true,
};

interface HeadingLevelDropdownProps {
	selectedLevel: number;
	onChange: ( targetLevel: number ) => void;
}

/**
 * Dropdown for selecting a heading level (1 through 6).
 *
 * @param  props Component props.
 *
 * @return The toolbar.
 */
export default function HeadingLevelDropdown( { selectedLevel, onChange }: HeadingLevelDropdownProps ): React.ReactElement {
	/**
	 * Renders the toggle element.
	 *
	 * @param onToggle The toggle function.
	 * @param isOpen Whether the toggle is open.
	 *
	 * @returns The rendered toggle.
	 */
	const renderToggle = useCallback( ( { onToggle, isOpen } ): JSX.Element => {
		/**
		 * Opens the heading dropdown when pressing the down arrow key.
		 *
		 * @param event The keyboard event.
		 */
		const openOnArrowDown = useCallback( ( event: KeyboardEvent ) => {
			if ( ! isOpen && event.key === "ArrowDown" ) {
				event.preventDefault();
				event.stopPropagation();
				onToggle();
			}
		}, [ onToggle ] );

		return (
			<ToolbarButton
				aria-expanded={ isOpen }
				aria-haspopup="true"
				icon={ <HeadingLevelIcon level={ selectedLevel } /> as unknown as Dashicon.Icon }
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore -- Attribute is available.
				label={ __( "Change heading level", "yoast-schema-blocks" ) }
				onClick={ onToggle }
				onKeyDown={ openOnArrowDown }
				showTooltip={ true }
				title={ __( "Change heading level", "yoast-schema-blocks" ) }
			/>
		);
	}, [] );

	/**
	 * Renders the content of the heading dropdown.
	 *
	 * @returns The rendered content.
	 */
	const renderContent = useCallback( (): JSX.Element => (
		<Toolbar
			className="block-library-heading-level-toolbar"
			label={ __( "Change heading level", "yoast-schema-blocks" ) }
		>
			<ToolbarGroup
				isCollapsed={ false }
				controls={ HEADING_LEVELS.map( ( targetLevel ) => {
					const isActive = targetLevel === selectedLevel;
					return {
						icon: (
							<HeadingLevelIcon
								level={ targetLevel }
							/>
						),
						title: sprintf(
							// translators: %s: heading level e.g: "1", "2", "3"
							__( "Heading %d", "yoast-schema-blocks" ),
							targetLevel,
						),
						isActive,
						/**
						 * OnClick handler, for when the heading icon is clicked.
						 */
						onClick() {
							onChange( targetLevel );
						},
					};
				} ) }
			/>
		</Toolbar>
	), [] );

	return (
		<Dropdown
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore -- Attribute is available.
			popoverProps={ POPOVER_PROPS }
			renderToggle={ renderToggle }
			renderContent={ renderContent }
		/>
	);
}
