import React from "react";
import styled from "styled-components";
import ProgressBar from "./ProgressBar";

export const Preview = styled.div`
	height: 700px;
	width: 100%;
	background-color: white;
`;

class ProgressBarTest extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 0,
		};
	}

	render() {
		console.log(this.state.value);
		return (
			<Preview>
				<button onClick={() => this.setState( { value: this.state.value - 10 } ) }>-10%</button>
				<button onClick={() => this.setState( { value: this.state.value + 10 } ) }>+10%</button>
				<ProgressBar max={100} value={this.state.value}/>
			</Preview>
		);
	}
}

export default ProgressBarTest;