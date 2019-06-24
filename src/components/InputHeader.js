import styled from 'styled-components';

import CONSTANTS from '../constants';

const InputHeader = styled.div`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.headerBg :
        CONSTANTS.colors.light.headerBg};
    border: .1rem solid gray;
    border-right: none;
    border-radius: .5rem 0 0 .5rem;
    color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.headerText :
        CONSTANTS.colors.light.headerText};
    display: inline-block;
    font-weight: 700;
    height: 1.75rem;
    left: calc(50% - 11rem);
    padding: 0 .5rem 0 0;
    position: absolute;
    text-align: right;
    top: 0;
    width: 7rem;
`;

export default InputHeader;