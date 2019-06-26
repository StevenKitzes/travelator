import styled from 'styled-components';

import CONSTANTS from '../constants';

const LoginButton = styled.div`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.heavy :
        CONSTANTS.colors.light.object};
    border-bottom: .15rem solid ${props => props.theme === CONSTANTS.dark ?
        'gray' :
        CONSTANTS.colors.light.heavy};
    border-left: .15rem solid ${props => props.theme === CONSTANTS.dark ?
        'gray' :
        CONSTANTS.colors.light.heavy};
    border-radius: 0 0 0 1rem;
    color: ${props => props.theme === CONSTANTS.dark ?
        'white' :
        'black'};
    cursor: pointer;
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    padding: 0 .5rem .25rem .75rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
`

export default LoginButton;