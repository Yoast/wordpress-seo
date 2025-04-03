import classNames from "classnames";
import PropTypes from "prop-types";
// import React, { forwardRef, useRef, useEffect, useState } from "react";
import React, { forwardRef } from "react";

// const positionClassNameMap = {
// 	top: "yst-popover--top",
// 	right: "yst-popover--right",
// 	bottom: "yst-popover--bottom",
// 	left: "yst-popover--left",
// };

// const variantClassNameMap = {
// 	light: "yst-popover--light",
// 	dark: "",
// };

/**
 * @param {JSX.node} children Content of the popover.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {string} [position] Position of the popover.
 * @param {string} [variant] Variant of the popover.
 * @returns {JSX.Element} The popover component.
 */

const Popover = forwardRef( ( {
	children,
	as: Component,
	isOpen,
	className,
	// position,
	...props
}, ref ) => {
	if ( ! isOpen ) {
		return null;
	}

	return (
		<>
			<div className="yst-popover-backdrop" />
			<Component
				className={ classNames( "yst-popover-container",
					className,
				) }
			>
				<div
					role="dialog"
					ref={ ref }
					className={ classNames( "yst-popover-content",
						className,
					) }
					aria-modal={ isOpen ? "true" : null }
					{ ...props }
				>
					{ children }
				</div>
			</Component>
		</>
	);
} );

Popover.displayName = "Popover";

Popover.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	isOpen: PropTypes.bool,
	className: PropTypes.string,
	// position: PropTypes.string.isRequired,
	// variant: PropTypes.string.isRequired,
};

Popover.defaultProps = {
	as: "div",
	isOpen: false,
	children: "",
	className: "",
};

export default Popover;


// 	const localRef = useRef( null );
// 	const popoverRef = ref || localRef;
//
// 	useEffect( () => {
// 		const dialog = popoverRef.current;
// 		if ( ! dialog ) {
// 			return;
// 		}
//
// 		if ( isOpen ) {
// 			if ( ! dialog.open ) {
// 				dialog.showModal();
// 			}
// 		} else {
// 			dialog.close();
// 		}
// 	}, [ isOpen ] );
//
// 	return (
// 		<>
// 			<div className="yst-popover-container">
// 				<dialog
// 					ref={ popoverRef }
// 					className="yst-popover-content"
// 					aria-modal="true"
// 					{ ...props }
// 				>
// 					{ children }
// 				</dialog>
// 			</div>
// 		</>
// 	);
// } );
