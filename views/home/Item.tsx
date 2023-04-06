import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import Circle from './smallCircle';

const Card = styled.View`
    margin: 5%;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 90px;

    background-color: #000;
`;

const Item = (props: {
    category_id: number;
    category_name: string;
    value: number;
    color: string;
}) => {
    return (
        <Card>
            <Circle radius={10} color={props.color} />
            <View style={{ position: 'absolute', marginTop: '6%' }}>
                <Text style={{ color: '#303841', marginLeft: '30%' }}>
                    {props.category_name}, {props.category_id}
                </Text>
                <Text style={{ color: '#94C3F6', marginTop: '8%', marginLeft: '11%' }}>
                    {props.value} руб
                </Text>
            </View>
        </Card>
    );
};

export default Item;
