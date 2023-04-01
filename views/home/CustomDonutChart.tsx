import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';
import * as shape from 'd3-shape';

interface ChartData {
    id: number;
    value: number;
    color: string;
}

interface DonutChartProps {
    data: ChartData[];
    size: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, size }) => {
    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Svg width={size} height={size}>
                    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill='#fff' />
                    <Circle cx={size / 2} cy={size / 2} r={size / 2.5} fill='#fff' />
                </Svg>
            </View>
        );
    }

    // Подготовка данных для d3-shape
    const pieData = shape.pie<ChartData>().value((d) => d.value)(data);
    const arcs = shape
        .arc<shape.PieArcDatum<ChartData>>()
        .outerRadius(size / 2)
        .innerRadius(size / 4);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G x={size / 2} y={size / 2}>
                    {pieData.map((slice, index) => {
                        const { color, id } = slice.data!;
                        return <Path key={id} d={arcs(slice)!} fill={color} />;
                    })}
                </G>
                <Circle cx={size / 2} cy={size / 2} r={size / 2.4} fill='#fff' />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        marginRight: 8,
        borderRadius: 8,
    },
    legendLabel: {
        fontSize: 16,
    },
});

export default DonutChart;
