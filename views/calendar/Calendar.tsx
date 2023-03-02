import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import Header from '../modular_components/Header';
import Content from './calendar_content/Content';
import Card from '../modular_components/Card';

const CardText = styled.Text`
    font-size: 13px;
    font-weight: 400;
`;

export default function Calendar() {
    return (
        <View style={{ backgroundColor:'#FFF', height: '100%'}}>
            <Header name='Calendar' style='1'/>
            <Content />
            <Card>
                <CardText>Зарплата</CardText>
                <CardText>09.03.2023</CardText>
                <CardText>40000 руб.</CardText>
            </Card>
        </View>
    )
}