import React, { forwardRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { TrashIcon, PlusIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import { Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

const variants = {
	add: {
		button: {
			Icon: PlusIcon,
			label: __( "Add", "wordpress-seo" ),
			variant: "secondary",
		},
		success: {
			Icon: CheckIcon,
			label: __( "Added!", "wordpress-seo" ),
		},
	},
	remove: {
		button: {
			Icon: TrashIcon,
			label: __( "Remove", "wordpress-seo" ),
			variant: "tertiary",
		},
		success: {
			Icon: XIcon,
			label: __( "Removed!", "wordpress-seo" ),
		},
	},
};


/**
 * The success message for the table buttons.
 *
 * @param {string} variant The variant of the success message.
 * @param {string} className The class name.
 *
 * @returns {JSX.Element} The success message.
 */
const SuccessMessage = ( { variant, className = "" } ) => {
	const SuccessIcon = variants[ variant ].success.Icon;
	return <div
		role="alert"
		className={
			classNames( "yst-success-message yst-animate-appear-disappear",
				`yst-success-message-${ variant }`,
				className,
			) }
	>
		<SuccessIcon className="yst-success-icon" />
		{ variants[ variant ].success.label }
	</div>;
};

SuccessMessage.propTypes = {
	variant: PropTypes.oneOf( [ "add", "remove" ] ),
	className: PropTypes.string,
};

/**
 *
 * @param {string} variant Whether it is an add button or not.
 * @param {string} className The class name.
 *
 * @returns {JSX.Element} The button.
 */
export const TableButton = forwardRef( ( { variant = "add", className = "", ...props }, ref ) => {
	const ButtonIcon = variants[ variant ].button.Icon;

	return (
		<Button
			{ ...props }
			ref={ ref }
			variant={ variants[ variant ].button.variant }
			size="small"
			className={ classNames(
				"yst-table-button",
				className,
			) }
		>
			<ButtonIcon className="yst-button-icon yst--mx-1" />
			{ variants[ variant ].button.label }
		</Button>
	);
} );

TableButton.propTypes = {
	variant: PropTypes.oneOf( [ "add", "remove" ] ).isRequired,
	className: PropTypes.string, // eslint-disable-line react/require-default-props
};

TableButton.displayName = "TableButton";

TableButton.SuccessMessage = SuccessMessage;
