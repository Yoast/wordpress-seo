import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";
import { times } from "lodash";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} A stepper bullet.
 */
const Bullet = ( { active, visited } ) => {
	return <div
		className={ classNames(
			// eslint-disable-next-line no-nested-ternary
			active ? "yst-bg-primary-500 yst-ring-4 yst-ring-primary-200" : visited ? "yst-bg-primary-500" : "yst-bg-gray-400",
			"yst-rounded-full yst-h-2 yst-w-2 yst-m-2 yst-flex-shrink-0",
		) }
	/>;
};

Bullet.propTypes = {
	active: PropTypes.bool,
	visited: PropTypes.bool,
};

Bullet.defaultProps = {
	active: false,
	visited: false,
};

/**
 * @returns {JSX.Element} The Navigation component.
 */
export default function Navigation( { step, setStep, maxSteps, navigateWhenDone } ) {
	/**
	 * Handles the Previous click.
	 * @returns {*} The updated step.
	 */
	const handlePrevClick = useCallback( () => setStep( step - 1 ), [ step, setStep ] );

	/**
	 * Handles the Next click.
	 * @returns {*} The updated step.
	 */
	const handleNextClick = useCallback( () => setStep( step + 1 ), [ step, setStep ] );

	const NextButton = useCallback( () => {
		if ( step === maxSteps ) {
			return <button className="yst-button yst-button--primary" onClick={ navigateWhenDone }>{ __( "Get started!", "admin-ui" ) }</button>;
		}
		return <button className="yst-button yst-button--primary" onClick={ handleNextClick }>{ __( "Next", "admin-ui" ) }</button>;
	}, [ step, maxSteps, handleNextClick, navigateWhenDone ] );

	return (
		<div className="yst-grid yst-grid-cols-3 yst-mt-auto yst-pt-4">
			<div className="yst-flex yst-justify-start yst-items-center">
				{ step !== 1 && <button className="yst-button yst-button--secondary" onClick={ handlePrevClick }>{ __( "Previous", "admin-ui" ) }</button> }
			</div>
			<div>
				<div className="yst-hidden sm:yst-block">
					<div className="yst-flex yst-justify-center">
						{ times(
							maxSteps,
							( index ) => <Bullet key={ index } active={ step === ( index + 1 ) } visited={ step > ( index + 1 ) } />,
						) }
					</div>
					{ /* translators: %1$s is replaced by the current step, %2$s is replaced by the number of total steps. */ }
					<p className="yst-text-center">{ sprintf( __( "Step %1$s of %2$s", "admin-ui" ), step, maxSteps ) }</p>
				</div>
			</div>
			<div className="yst-flex yst-justify-end yst-items-center">
				<NextButton />
			</div>
		</div>
	);
}

Navigation.propTypes = {
	step: PropTypes.number,
	setStep: PropTypes.func,
	maxSteps: PropTypes.number,
	navigateWhenDone: PropTypes.func,
};

Navigation.defaultProps = {
	step: 1,
	setStep: () => {},
	maxSteps: 6,
	navigateWhenDone: () => {},
};
