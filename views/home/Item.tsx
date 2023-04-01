import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';
import Circle from './smallCircle';

import { borderBillionMillionThousand } from '../tools/iosys';

// type ItemProps = {
//     category_id: number;
//     category_name: string;
//     category_icon: Number;
//     category_type: string;
//     color: string;
//     value: number;
// };

const CardZAD = styled.View`
    display: flex;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;
    flex-wrap: wrap;
    flex-direction: row;
    margin: 10px 0px 2px 0px;
`;

const Card = styled.View`
    margin: 5%;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 90px;

    background-color: #000;
`;

const FlatListsss = styled.View`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // width: 170px;
    height: 90px;
    border: 1px solid #fafafa;
    border-radius: 20px;
    background-color: #000;
    padding: 10px;
    margin: 5px;
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
