import { Text, View } from "react-native";
import styled from "styled-components/native";

import Header from "../modular_components/Header";
import Card from "../modular_components/Card";


const ActiveIndicator = styled.View`
    background-color: #6FE6C2;
    height: 20px;
    width: 20px;
`
const InactiveIndicator = styled.View`
    background-color: #D9D9D9;
    height: 20px;
    width: 20px;
`

const Scroll = styled.ScrollView`
    margin: 0;
    max-height: 100%;
`
const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

export default function Account(){
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <Header name="Accounts" style="1"/>
            <Scroll>
                <Container>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <ActiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>

                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                    <Card>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <InactiveIndicator/>
                                <Text style={{marginLeft: 10}}>Active</Text>
                            </View>
                            <Text>5000 руб.</Text>
                        </View>
                    </Card>
                </Container>
            </Scroll>
        </View>
    )
}