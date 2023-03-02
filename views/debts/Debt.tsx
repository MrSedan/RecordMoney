import { Text, View } from 'react-native';
import Card from '../modular_components/Card';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';

const Scroll = styled.ScrollView`
    margin: 0;
    height: 100%;
    max-height: 100%;
`
const Container = styled.View`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`
const DebtToMe = styled.TouchableOpacity`
    border: 1px solid #3FDEAE;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`
const DebtFromMe = styled.TouchableOpacity`
    border: 1px solid #C9C9C9;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-start: 0;
    width: 48%;
    border-radius: 5px;
`


export default function Debt() {
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <Header name='Debt' style='1' />
            <View style={{margin: 5, flex: 1, flexDirection: 'row', marginBottom: 40, justifyContent: 'space-around'}}>
                <DebtToMe><Text style={{color: '#3FDEAE', fontSize: 19}}>Должны мне</Text></DebtToMe>
                <DebtFromMe><Text style={{color: '#C9C9C9', fontSize: 19}}>Должен я</Text></DebtFromMe>
            </View>
            <Scroll>
                <Container>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>

                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>88005553535</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Денис!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>500</Text>
                    </View>
                </Card>
                <Card>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Руслан!</Text>
                            <Text>05.03.2023</Text>
                            <Text>5000 руб.</Text>
                        </View>
                        <Text>500</Text>
                    </View>
                </Card>
                </Container>
                

            </Scroll>
        </View>
    )
}