// Stub for react-native-chart-kit on web
// This prevents requireNativeComponent errors on web platform

import React from 'react';
import { View, Text } from 'react-native';

const ChartStub = ({ children, ...props }) => (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ color: '#666' }}>Charts not available on web</Text>
  </View>
);

export const LineChart = ChartStub;
export const PieChart = ChartStub;
export const BarChart = ChartStub;
export const ContributionGraph = ChartStub;
export const StackedBarChart = ChartStub;
export const ProgressChart = ChartStub;

export default {
  LineChart,
  PieChart,
  BarChart,
  ContributionGraph,
  StackedBarChart,
  ProgressChart,
};

