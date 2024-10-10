import React, { useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { TrashIcon, PlusIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import { Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

const variant = {
	add: {
		ButtonIcon: PlusIcon,
		buttonIconClass: "yst-text-slate-400",
		buttonText: __( "Add", "wordpress-seo" ),
		buttonClass: "yst-text-slate-700",
		SuccessIcon: CheckIcon,
		sucessIconClass: "yst-text-green-400",
		successText: __( "Added!", "wordpress-seo" ),
		variant: "secondary",
	},
	remove: {
		ButtonIcon: TrashIcon,
		buttonIconClass: "yst-text-red-500",
		buttonText: __( "Remove", "wordpress-seo" ),
		buttonClass: "yst-text-red-500",
		SuccessIcon: XIcon,
		sucessIconClass: "yst-text-red-500",
		successText: __( "Removed!", "wordpress-seo" ),
		variant: "tertiary",
	},
};

/**
 *
 * @param {string} type Whether it is an add button or not.
 * @param {Function} remove The remove function.
 * @param {Function} add The add function.
 *
 * @returns {wp.Element} The button.
 */
const TableButton = ( { type = "add", remove, add } ) => {
	const [ successClass, setSuccessClass ] = useState( "" );
	const [ buttonType, setButtonType ] = useState( type );
	const [ successState, setSuccessState ] = useState( false );
	const SuccessIcon = variant[ buttonType ].SuccessIcon;
	const ButtonIcon = variant[ buttonType ].ButtonIcon;
	variant.add.onClick = add;
	variant.remove.onClick = remove;

	const onClick = useCallback( () => {
		variant[ buttonType ].onClick();
		setSuccessState( true );
	}, [ remove, add ] );

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
					classNames( "yst-flex yst-items-center yst-justify-center yst-gap-1 yst-text-slate-600 yst-text-xs yst-px-3 yst-py-[5px] yst-transition yst-duration-1000 yst-ease-in-out",
						successClass,
			 ) }
			>
				<SuccessIcon
					className={ classNames(
						"yst-w-4 yst-h-4",
						variant[ buttonType ].sucessIconClass,
				 ) }
				/>
				{ variant[ buttonType ].successText }
			</div>
		);
	}

	return (
		<Button
			variant={ variant[ buttonType ].variant }
			size="small"
			className={ classNames(
				"yst-flex yst-items-center yst-justify-center yst-gap-2 yst-text-xs",
				variant[ buttonType ].buttonClass )
			}
			onClick={ onClick }
		>
			<ButtonIcon
				className={
					classNames(
						"yst-w-4 yst-h-4",
						variant[ buttonType ].buttonIconClass ) }
			/>
			{ variant[ buttonType ].buttonText }
		</Button>
	);
};

TableButton.propTypes = {
	type: PropTypes.oneOf( [ "add", "remove" ] ),
	remove: PropTypes.func.isRequired,
	add: PropTypes.func.isRequired,
};

export default TableButton;
