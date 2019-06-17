import styled from 'styled-components';

const ActionButton = styled.img`
    cursor: pointer;
    float: right;
    height: 1.5em;
    margin: 0.4em 0 0 .2em;
    text-align: center;
    transform: ${props => props.verticalMirror ?
        'rotate(180deg)' :
        'rotate(0deg)'};
    width: 1.5em;
`;

export default ActionButton;