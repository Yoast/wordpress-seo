import { DocumentAddIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { isEmpty, noop } from "lodash";
import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useState } from "react";

import Link from "../link";

/**
 * File input with drag-and-drop support.
 *
 * @param {string} id Id.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} selectLabel Label for default select button.
 * @param {string} dropLabel Label for drop area.
 * @param {string} screenReaderLabel Screen reader label.
 * @param {string} selectDescription Description for select area.
 * @param {boolean} disabled Disabled state.
 * @param {JSX.Element} iconAs Icon to show in select area.
 * @param {Function} onChange The callback for when a file is uploaded.
 * @param {Function} onDrop The callback for when a file is dropped.
 * @param {string} className Classname.
 * @returns {JSX.Element} The FileInput component.
 */
const FileInput = forwardRef( ( {
	id,
	name,
	value,
	selectLabel,
	dropLabel,
	screenReaderLabel,
	selectDescription,
	disabled,
	iconAs: IconComponent,
	onChange,
	onDrop,
	className,
	...props
}, ref ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );

	const handleDragEnter = useCallback( ( event ) => {
		event.preventDefault();
		if ( ! isEmpty( event.dataTransfer.items ) ) {
			setIsDragOver( true );
		}
	}, [ setIsDragOver ] );

	const handleDragLeave = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
	}, [ setIsDragOver ] );

	const handleDragOver = useCallback( ( event ) => {
		event.preventDefault();
	}, [] );

	const handleDrop = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
		onDrop( event );
	}, [ setIsDragOver, onDrop ] );

	return (
		<div
			onDragEnter={ handleDragEnter }
			onDragLeave={ handleDragLeave }
			onDragOver={ handleDragOver }
			onDrop={ handleDrop }
			className={ classNames( "yst-file-input", {
				"yst-is-drag-over": isDragOver,
				"yst-is-disabled": disabled,
				className,
			} ) }
		>
			<div className="yst-file-input__content">
				<IconComponent className="yst-file-input__icon" />
				<div className="yst-file-input__labels">
					<input
						ref={ ref }
						type="file"
						id={ id }
						name={ name }
						value={ value }
						onChange={ onChange }
						className="yst-file-input__input"
						aria-labelledby={ screenReaderLabel }
						disabled={ disabled }
						{ ...props }
					/>
					<Link as="label" htmlFor={ id } className="yst-file-input__select-label">{ selectLabel }</Link>
					<span>&nbsp;</span>
					{ dropLabel }
				</div>
				{ selectDescription && <span>{ selectDescription }</span> }
			</div>
		</div>
	);
} );

FileInput.displayName = "FileInput";
FileInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	selectLabel: PropTypes.string.isRequired,
	dropLabel: PropTypes.string.isRequired,
	screenReaderLabel: PropTypes.string.isRequired,
	selectDescription: PropTypes.string,
	disabled: PropTypes.bool,
	iconAs: PropTypes.elementType,
	onChange: PropTypes.func.isRequired,
	onDrop: PropTypes.func,
	className: PropTypes.string,
};
FileInput.defaultProps = {
	selectDescription: "",
	disabled: false,
	iconAs: DocumentAddIcon,
	className: "",
	onDrop: noop,
};

export default FileInput;
