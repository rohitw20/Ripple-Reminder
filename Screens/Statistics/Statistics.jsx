import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { colors, currentProgressScreen, footerScreen } from "../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { createStackNavigator } from "@react-navigation/stack";
import PieChartComp from "../../Components/PieChartComp";
import BezierChartComp from "../../Components/BezierChartComp";
import BarChartComp from "../../Components/BarChartComp";
import { SafeAreaProvider } from "react-native-safe-area-context";

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const Statistics = () => {
  const Stack = createStackNavigator();
  const [footerScreenName, setFooterScreenName] = useAtom(footerScreen);
  const [curr, setCurr] = useAtom(currentProgressScreen);
  const navigation = useNavigation();

  useFocusEffect(() => setFooterScreenName("StatisticsScreen"));

  return (
    <SafeAreaProvider>
      <View style={[tw`flex flex-row justify-between  pb-2`]}>
        <TouchableOpacity
          onPress={() => {
            setCurr("ProgressRing");
            navigation.navigate("ProgressRing");
          }}
          style={[
            tw`  py-2 w-1/3 border-b shadow-md px-4 flex items-center justify-center border-white `,
            {
              backgroundColor: curr === "ProgressRing" ? colors.green : "white",
              borderRightColor: "black",
              borderWidth: 1,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text
            style={[
              tw`${
                curr === "ProgressRing" ? "text-white" : "text-black"
              } text-lg ${curr === "ProgressRing" && "font-bold text-xl"}`,
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurr("ProgressBarChart");
            navigation.navigate("ProgressBarChart");
          }}
          style={[
            tw`  py-2 w-1/3 border-b shadow-md px-4 flex items-center justify-center border-white `,
            {
              backgroundColor:
                curr === "ProgressBarChart" ? colors.green : "white",
              borderRightColor: "black",
              borderWidth: 1,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text
            style={[
              tw`${
                curr === "ProgressBarChart" ? "text-white" : "text-black"
              } text-lg ${curr === "ProgressBarChart" && "font-bold text-xl"}`,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurr("ProgressLineChart");
            navigation.navigate("ProgressLineChart");
          }}
          style={[
            tw`  py-2 w-1/3 border-b shadow-md px-4 flex items-center justify-center border-white `,
            {
              backgroundColor:
                curr === "ProgressLineChart" ? colors.green : "white",
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text
            style={[
              tw`${
                curr === "ProgressLineChart" ? "text-white" : "text-black"
              } text-lg ${curr === "ProgressLineChart" && "font-bold text-xl"}`,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true, // Enable gesture navigation
          gestureDirection: "horizontal", // Set gesture direction
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="ProgressRing"
          component={PieChartComp}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="ProgressBarChart"
          component={BarChartComp}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="ProgressLineChart"
          component={BezierChartComp}
          options={horizontalAnimation}
        />
      </Stack.Navigator>
      {/* <PieChart />
      <BezierChart /> */}
    </SafeAreaProvider>
  );
};

export default Statistics;
