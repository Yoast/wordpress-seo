import styled from "styled-components";

export default styled.div`
	margin-top: ${ props => props.marginTop ? props.marginTop : "16px" };
`;
