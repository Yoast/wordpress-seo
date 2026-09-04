/* global yoastIndexingData */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, NewButton, ProgressBar } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import AbstractIndexation, { indexationDefaultProps, indexationPropTypes, STATE } from "./AbstractIndexation";
import IndexingError from "./IndexingError";

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
class Indexation extends AbstractIndexation {
	/**
	 * Renders the start button.
	 *
	 * @returns {JSX.Element|null} The start button.
	 */
	renderStartButton() {
		return <NewButton
			variant="primary"
			onClick={ this.startIndexing }
		>
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	/**
	 * Renders the stop button.
	 *
	 * @returns {JSX.Element|null} The stop button.
	 */
	renderStopButton() {
		return <NewButton
			variant="secondary"
			onClick={ this.stopIndexing }
		>
			{ __( "Stop SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	/**
	 * Renders the disabled tool.
	 *
	 * @returns {JSX.Element} The disabled tool.
	 */
	renderDisabledTool() {
		return <Fragment>
			<p>
				<NewButton
					variant="secondary"
					disabled={ true }
				>
					{ __( "Start SEO data optimization", "wordpress-seo" ) }
				</NewButton>
			</p>
			<Alert type={ "info" }>
				{ __( "SEO data optimization is disabled for non-production environments.", "wordpress-seo" ) }
			</Alert>
		</Fragment>;
	}

	/**
	 * Renders the progress bar, plus caption.
	 *
	 * @returns {JSX.Element} The progress bar, plus caption.
	 */
	renderProgressBar() {
		return <Fragment>
			<ProgressBar
				style={ { height: "16px", margin: "8px 0" } }
				progressColor={ colors.$color_pink_dark }
				max={ parseInt( this.state.amount, 10 ) }
				value={ this.state.processed }
			/>
			<p style={ { color: colors.$palette_grey_text } }>
				{ __( "Optimizing SEO data… This may take a while.", "wordpress-seo" ) }
			</p>
		</Fragment>;
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
		/>;
	}

	/**
	 * Renders the indexing tool.
	 *
	 * @returns {JSX.Element} The indexing tool.
	 */
	renderTool() {
		return (
			<Fragment>
				{ this.isState( STATE.IN_PROGRESS ) && this.renderProgressBar() }
				{ this.isState( STATE.ERRORED ) && this.renderErrorAlert() }
				{ this.isState( STATE.IN_PROGRESS )
					? this.renderStopButton()
					: this.renderStartButton()
				}
			</Fragment>
		);
	}

	/**
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return this.renderDisabledTool();
		}

		if ( this.isState( STATE.COMPLETED ) || this.state.amount === 0 ) {
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return this.renderTool();
	}
}

Indexation.propTypes = indexationPropTypes;
Indexation.defaultProps = indexationDefaultProps;

export default Indexation;
