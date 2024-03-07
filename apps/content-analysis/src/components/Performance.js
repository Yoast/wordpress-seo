import { IconButton, Input } from "@yoast/components";
import { reduce } from "lodash-es";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import { Paper } from "yoastseo";
import {
	ADD_PERFORMANCE_RESULT,
	SET_PERFORMANCE_BATCH_SIZE,
	SET_PERFORMANCE_RESEARCHES,
	SET_PERFORMANCE_RESULTS,
} from "../redux/actions/performance";
import { prepareResearcher } from "../utils/prepareResearcher";
import { ButtonContainer, Container, HorizontalContainer } from "./Container";
import { DisabledWrapper } from "./DisabledWrapper";
import { H3 } from "./headings";
import { SimpleMultiSelect } from "./SimpleMultiSelect";

const COLUMNS = [
	{
		Header: "Research",
		accessor: "research",
	},
	{
		Header: "Total runs",
		accessor: "runs",
	},
	{
		Header: "Average run",
		accessor: "average",
	},
	{
		Header: "Fastest run",
		accessor: "min",
	},
	{
		Header: "Slowest run",
		accessor: "max",
	},
];

const measureResearch = ( researchName, researcher, batchSize ) => {
	const NAME = `yst-${ researchName }`;
	const START = `${ NAME }-start`;

	// See: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry
	performance.mark( START );
	for ( let i = 0; i < batchSize; i++ ) {
		researcher.getResearch( researchName );
	}

	return performance.measure( NAME, START ).duration;
};

const logPerformanceDuration = list => {
	list.getEntries().forEach( ( entry ) => {
		if ( entry.name.startsWith( "yst-" ) ) {
			switch ( entry.entryType ) {
				case "mark":
					// eslint-disable-next-line no-console
					console.log( `${ entry.name.substring( 4 ) } startTime: ${ entry.startTime }` );
					break;
				case "measure":
					// eslint-disable-next-line no-console
					console.log( `${ entry.name.substring( 4 ) } duration: ${ entry.duration }` );
					break;
			}
		}
	} );
};

const usePerformanceObserver = ( callback, entryTypes ) => {
	useEffect( () => {
		const observer = new PerformanceObserver( callback );
		observer.observe( { entryTypes: entryTypes } );

		return () => observer.disconnect();
		// Leave entryTypes out of the dependency array, or it does not work.
	}, [ callback ] );
};

const Performance = ( {
	researcher,
	availableResearches,
	selectedResearches,
	setSelectedResearches,
	batchSize,
	setBatchSize,
	results,
	resetResults,
	addResult,
} ) => {
	const [ isRunning, setIsRunning ] = useState( false );

	const handleSetRunAmount = useCallback( event => {
		setBatchSize( parseInt( event.target.value, 10 ) );
	}, [ setBatchSize ] );

	const handleDoTimedRun = useCallback( async () => {
		setIsRunning( true );
		// Give the UI some time to update.
		await new Promise( resolve => setTimeout( resolve, 0 ) );
		for ( const researchName of selectedResearches ) {
			const timeElapsed = measureResearch( researchName, researcher, batchSize );
			addResult( researchName, timeElapsed, batchSize );
			// Give the UI some time to update.
			await new Promise( resolve => setTimeout( resolve, 0 ) );
		}
		setIsRunning( false );
	}, [ selectedResearches, researcher, batchSize, setIsRunning, addResult ] );

	usePerformanceObserver( logPerformanceDuration, [ "measure" ] );

	return (
		<Fragment>
			<label htmlFor="performance-select-researches">
				<H3>Select research</H3>
			</label>
			<SimpleMultiSelect
				inputId="performance-select-researches"
				value={ selectedResearches }
				options={ availableResearches }
				onChange={ setSelectedResearches }
				isMulti={ true }
			/>
			<HorizontalContainer>
				<label htmlFor={ "performance-batch-size" }>
					<H3>Select batch size</H3>
				</label>
				<Input
					type="number"
					value={ batchSize }
					onChange={ handleSetRunAmount }
					optionalAttributes={ { id: "performance-batch-size" } }
				/>
			</HorizontalContainer>

			<ButtonContainer>
				<DisabledWrapper isDisabled={ isRunning }>
					<IconButton
						icon={ isRunning ? "loading-spinner" : "search" }
						onClick={ handleDoTimedRun }
						style={ { width: "100%", borderTopRightRadius: "0px", borderBottomRightRadius: "0px" } }
					>
						Run research
					</IconButton>
				</DisabledWrapper>
				<IconButton icon="times" onClick={ resetResults }>Reset results</IconButton>
			</ButtonContainer>

			<Container>
				<ReactTable
					data={ results }
					columns={ COLUMNS }
					defaultPageSize={ 100 }
					minRows={ 3 }
				/>
			</Container>
		</Fragment>
	);
};

export default connect(
	state => {
		const researcher = prepareResearcher( Paper.parse( state.paper ), state.options.useMorphology );

		return {
			researcher,
			availableResearches: Object.keys( researcher.getAvailableResearches() ),
			batchSize: state.performance.batchSize,
			selectedResearches: state.performance.researches,
			results: reduce( state.performance.results, ( acc, value, key ) => {
				acc.push( {
					research: key,
					runs: value.runs.length,
					average: value.average,
					min: value.min,
					max: value.max,
				} );
				return acc;
			}, [] ),
		};
	},
	dispatch => ( {
		setSelectedResearches: researches => dispatch( { type: SET_PERFORMANCE_RESEARCHES, payload: researches } ),
		setBatchSize: batchSize => dispatch( { type: SET_PERFORMANCE_BATCH_SIZE, payload: batchSize } ),
		resetResults: () => dispatch( { type: SET_PERFORMANCE_RESULTS, payload: {} } ),
		addResult: ( research, timeElapsed, batchSize ) => dispatch( {
			type: ADD_PERFORMANCE_RESULT,
			payload: { research, timeElapsed, batchSize },
		} ),
	} ),
)( Performance );
