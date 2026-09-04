/* global yoastIndexingData */
import { Fragment } from "@wordpress/element";
import { Transition } from "@headlessui/react";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";

import AbstractIndexation, { STATE, indexationDefaultProps, indexationPropTypes } from "../../../../components/AbstractIndexation";
import IndexingError from "./indexing-error";
import Alert from "../../base/alert";

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
class Indexation extends AbstractIndexation {
	/**
	 * @inheritDoc
	 */
	getAlreadyIndexedStateName() {
		return "already_done";
	}

	/**
	 * Renders the start button.
	 *
	 * @returns {JSX.Element|null} The start button.
	 */
	renderStartButton() {
		return <Button
			variant="secondary"
			onClick={ this.startIndexing }
			id="indexation-data-optimization"
			data-hiive-event-name="clicked_start_data_optimization"
		>
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</Button>;
	}

	/**
	 * Renders the stop button.
	 *
	 * @returns {JSX.Element|null} The stop button.
	 */
	renderStopButton() {
		return <Button
			variant="secondary"
			onClick={ this.stopIndexing }
		>
			{ __( "Stop SEO data optimization", "wordpress-seo" ) }
		</Button>;
	}

	/**
	 * Renders the disabled tool.
	 *
	 * @returns {JSX.Element} The disabled tool.
	 */
	renderDisabledTool() {
		return <Fragment>
			<p>
				<Button
					variant="secondary"
					disabled={ true }
					id="indexation-data-optimization"
				>
					{ __( "Start SEO data optimization", "wordpress-seo" ) }
				</Button>
			</p>
			<Alert type={ "info" } className="yst-mt-6">
				{ __( "SEO data optimization is disabled for non-production environments.", "wordpress-seo" ) }
			</Alert>
		</Fragment>;
	}

	/**
	 * Renders the progress bar.
	 *
	 * @returns {WPElement} The progress bar.
	 */
	renderProgressBar() {
		let percentageIndexed = 0;
		if ( this.isState( STATE.COMPLETED ) ) {
			percentageIndexed = 100;
		}
		if ( this.isState( STATE.IN_PROGRESS ) ) {
			percentageIndexed = ( this.state.processed / parseInt( this.state.amount, 10 ) ) * 100;
		}

		return <div className="yst-w-full yst-bg-slate-200 yst-rounded-full yst-h-2.5 yst-mb-4">
			<div
				className="yst-transition-[width] yst-ease-linear yst-bg-primary-500 yst-h-2.5 yst-rounded-full"
				style={ { width: `${ percentageIndexed }%` } }
			/>
		</div>;
	}

	/**
	 * Renders the italics caption.
	 *
	 * @returns {WPElement} the italics caption.
	 */
	renderCaption() {
		return <AnimateHeight
			id="optimization-in-progress-text"
			height={ this.isState( STATE.IN_PROGRESS ) ? "auto" : 0 }
			easing="linear"
			duration={ 300 }
		>
			<p className={ "yst-text-sm yst-italic yst-mb-4 yst-mt-4" }>
				{
					__( "SEO data optimization is running… You can safely move on to the next steps of this configuration.",
						"wordpress-seo" )
				}
			</p>
		</AnimateHeight>;
	}

	/**
	 * Renders the error alert.
	 *
	 * @returns {JSX.Element} The error alert.
	 */
	renderErrorAlert() {
		return <IndexingError
			message={ yoastIndexingData.errorMessage }
			error={ this.state.error }
			className={ "yst-mb-4" }
		/>;
	}

	/* eslint-disable complexity */
	/**
	 * Renders the component
	 *
	 * @returns {WPElement} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return this.renderDisabledTool();
		}

		return (
			<div className="yst-relative">
				{ this.props.children }
				<Transition
					unmount={ false }
					show={ this.isState( STATE.ERRORED ) ||
						this.isState( STATE.IN_PROGRESS ) ||
						( this.isState( STATE.IDLE ) && this.state.amount > 0 ) }
					leave="yst-transition-opacity yst-duration-1000"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					{ this.renderProgressBar() }
					{ this.isState( STATE.ERRORED ) && this.renderErrorAlert() }
					{ this.isState( STATE.IN_PROGRESS )
						? this.renderStopButton()
						: this.renderStartButton()
					}
					{ this.renderCaption() }
				</Transition>
			</div>
		);
	}
}
/* eslint-enable complexity */

Indexation.propTypes = {
	...indexationPropTypes,
	children: PropTypes.node,
};

Indexation.defaultProps = {
	...indexationDefaultProps,
	children: null,
};

export default Indexation;
