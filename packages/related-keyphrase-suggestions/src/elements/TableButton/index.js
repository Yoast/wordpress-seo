import React, { useEffect, useState, useCallback } from "react";
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
 *
 * @param {string} type Whether it is an add button or not.
 * @param {Function} onRemove The remove function.
 * @param {Function} onAdd The add function.
 * @param {boolean} disabled Whether the button is disabled or not.
 *
 * @returns {JSX.Element} The button.
 */
const TableButton = ( { type = "add", onRemove, onAdd, disabled = false } ) => {
	const [ successClass, setSuccessClass ] = useState( "" );
	const [ buttonType, setButtonType ] = useState( type );
	const [ successState, setSuccessState ] = useState( false );
	const SuccessIcon = variants[ buttonType ].success.Icon;
	const ButtonIcon = variants[ buttonType ].button.Icon;
	variants.add.onClick = onAdd;
	variants.remove.onClick = onRemove;

	const onClick = useCallback( () => {
		variants[ buttonType ].onClick();
		setSuccessState( true );
	}, [ onRemove, onAdd ] );

	useEffect( () => {
		if ( successState ) {
			const timer = setTimeout( () => {
				setSuccessClass( "yst-opacity-0" );
			}, 800 );

			const timerRestore = setTimeout( () => {
				setSuccessClass( "" );
				if ( buttonType === "add" ) {
					setButtonType( "remove" );
				}
				if ( buttonType === "remove" ) {
					setButtonType( "add" );
				}
				setSuccessState( false );
			}, 1500 );

			return () => {
				clearTimeout( timer );
				clearTimeout( timerRestore );
			};
		}
		setSuccessClass( "" );
	}, [ successState ] );


	if ( successState ) {
		return (
			<div
				className={
					classNames( "yst-success-message",
						`yst-success-message-${ buttonType }`,
						successClass,
			 ) }
			>
				<SuccessIcon className="yst-success-icon" />
				{ variants[ buttonType ].success.label }
			</div>
		);
	}

	return (
		<Button
			variant={ variants[ buttonType ].button.variant }
			size="small"
			className="yst-keyphrase-button"
			onClick={ onClick }
			disabled={ disabled }
		>
			<ButtonIcon className="yst-button-icon" />
			{ variants[ buttonType ].button.label }
		</Button>
	);
};

TableButton.propTypes = {
	type: PropTypes.oneOf( [ "add", "remove" ] ),
	onRemove: PropTypes.func.isRequired,
	onAdd: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default TableButton;
