import { useState, useCallback } from "@wordpress/element";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DocumentAddIcon } from "@heroicons/react/outline";

import { useRootContext } from "../../hooks";
import Link from "../link";

/**
 * @param {string} id The callback for when a file is uploaded.
 * @param {string} name The callback for when a file is uploaded.
 * @param {string} value The callback for when a file is uploaded.
 * @param {string} selectLabel The callback for when a file is uploaded.
 * @param {string} dropLabel The callback for when a file is uploaded.
 * @param {string} screenReaderLabel The callback for when a file is uploaded.
 * @param {string} selectDescription The callback for when a file is uploaded.
 * @param {boolean} isDisabled The callback for when a file is uploaded.
 * @param {JSX.Element} iconAs The callback for when a file is uploaded.
 * @param {Function} onChange The callback for when a file is uploaded.
 * @param {string} className The callback for when a file is uploaded.
 * @returns {JSX.Element} The FileInput component.
 */
const FileInput = ( {
	id,
	name,
	value,
	selectLabel,
	dropLabel,
	screenReaderLabel,
	selectDescription = "",
	isDisabled = false,
	iconAs: IconComponent = DocumentAddIcon,
	onChange,
	className = "",
	...props
} ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );
	const { isRtl } = useRootContext();

	const handleDragEnter = useCallback( ( event ) => {
		event.preventDefault();
		if ( ! isEmpty( event.dataTransfer.items ) ) {
			setIsDragOver( true );
		}
	}, [] );

	const handleDragLeave = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
	}, [] );

	const handleDragOver = useCallback( ( event ) => {
		event.preventDefault();
	}, [] );

	const handleDrop = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
		if ( ! isEmpty( event.dataTransfer.files ) ) {
			onChange( event.dataTransfer.files[ 0 ] );
		}
	}, [ setIsDragOver, onChange ] );

	return (
		<div
			onDragEnter={ handleDragEnter }
			onDragLeave={ handleDragLeave }
			onDragOver={ handleDragOver }
			onDrop={ handleDrop }
			className={ classNames( "yst-file-input", {
				"yst-is-drag-over": isDragOver,
				"yst-is-disabled": isDisabled,
				className,
			} ) }
		>
			<div className="yst-file-input__content">
				<IconComponent className="yst-file-input__icon" />
				<div
					className={ classNames(
						"yst-file-input__labels", {
							"yst-flex-row-reverse": isRtl,
						} ) }
				>
					<input
						type="file"
						id={ id }
						name={ name }
						value={ value }
						onChange={ onChange }
						className="yst-file-input__input"
						aria-labelledby={ screenReaderLabel }
						disabled={ isDisabled }
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
};

FileInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	selectLabel: PropTypes.string.isRequired,
	dropLabel: PropTypes.string.isRequired,
	screenReaderLabel: PropTypes.string.isRequired,
	selectDescription: PropTypes.string,
	isDisabled: PropTypes.bool,
	iconAs: PropTypes.elementType,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

export default FileInput;
