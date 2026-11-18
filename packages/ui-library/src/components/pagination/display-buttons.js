import { clamp, range, rangeRight, round } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import Button from "./button";

/**
 * @returns {JSX.Element} The element.
 */
const DisplayTruncated = () => <span className="yst-pagination-display__truncated">...</span>;

/**
 * Displays page buttons.
 * @param {number} current The current page. Start at 1.
 * @param {number} total The total pages.
 * @param {function} onNavigate Callback for requested page navigation.
 * @param {number} maxPageButtons For variant buttons: the maximum number of buttons to show.
 * @param {boolean} disabled Whether the buttons are disabled.
 * @returns {JSX.Element} The element.
 */
const DisplayButtons = ( { current, total, onNavigate, maxPageButtons, disabled } ) => {
	const amount = useMemo( () => clamp( total, 1, maxPageButtons ), [ total, maxPageButtons ] );
	const half = useMemo( () => round( amount / 2, 0 ), [ amount ] );
	const showTruncated = useMemo( () => total > maxPageButtons && maxPageButtons > 1 && current !== half + 1, [ total, maxPageButtons, half ] );
	const startOfSecondRange = useMemo( () => total - ( amount - half ) + 1, [ total, amount, half ] );
	const currentIsTruncated = useMemo( () => current > half && current < startOfSecondRange, [ current, half, startOfSecondRange ] );

	return (
		<>
			{ range( half ).map( index => {
				const page = index + 1;
				return (
					<Button
						key={ page }
						className="yst-px-4"
						onClick={ onNavigate }
						data-page={ page }
						active={ page === current }
						disabled={ disabled }
					>
						{ page }
					</Button>
				);
			} ) }
			{ showTruncated && <DisplayTruncated /> }
			{ currentIsTruncated && (
				<>
					<Button
						className="yst-px-4"
						onClick={ onNavigate }
						data-page={ current }
						active={ true }
						disabled={ disabled }
					>
						{ current }
					</Button>
					{ current !== startOfSecondRange - 1 && <DisplayTruncated /> }
				</>
			) }
			{ rangeRight( amount - half ).map( index => {
				const page = total - index;
				return (
					<Button
						key={ page }
						className="yst-px-4"
						onClick={ onNavigate }
						data-page={ page }
						active={ page === current }
						disabled={ disabled }
					>
						{ page }
					</Button>
				);
			} ) }
		</>
	);
};

DisplayButtons.displayName = "Pagination.DisplayButtons";
DisplayButtons.propTypes = {
	current: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	onNavigate: PropTypes.func.isRequired,
	maxPageButtons: PropTypes.number.isRequired,
	disabled: PropTypes.bool.isRequired,
};

export default DisplayButtons;
