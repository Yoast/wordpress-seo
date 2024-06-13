import React from 'react';
import { ReactComponent as SparklesIcon } from './sparkles-icon.svg';

const IconWithConditionalStyle = ({ pressed }) => {
    return (
        <div>
            <SparklesIcon pressed={pressed} />
        </div>
    );
};

export default IconWithConditionalStyle;
