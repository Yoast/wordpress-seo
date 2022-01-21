import { useWordProofTimestamper } from "../helpers/wordproof";

/**
 * WordProof timestamper component that implements the useWordProofTimestamper hook
 * for timestamping posts on save.
 * This is a separate component because hooks can not be conditionally rendered while components can.
 *
 * @returns {null} Nothing.
 */
const WordProofTimestamper = () => {
	useWordProofTimestamper();
	return null;
};

export default WordProofTimestamper;
