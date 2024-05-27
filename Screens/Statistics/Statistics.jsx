import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { colors, currentProgressScreen, footerScreen } from "../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Daily from "./Daily";
import OneTime from "./OneTime";

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
      {/* <Text style={[tw`bg-white text-xl text-center py-1`]}>Statistics</Text> */}
      <View style={[tw`flex flex-row justify-between  `]}>
        <TouchableOpacity
          onPress={() => {
            setCurr("DailyProgress");
            navigation.navigate("DailyProgress");
          }}
          style={[
            tw`  py-2 w-1/2 border shadow-md px-4 flex items-center justify-center bg-white`,
            {
              borderBottomColor:
                curr === "DailyProgress" ? colors.blue : "white",
              borderBottomWidth: 1,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            },
          ]}
        >
          <Text
            style={[
              tw` 
               text-lg`,
            ]}
          >
            Daily Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurr("OneTimeProgress");
            navigation.navigate("OneTimeProgress");
          }}
          style={[
            tw`  py-2 w-1/2 border shadow-md px-4 flex items-center justify-center bg-white`,
            {
              borderBottomColor:
                curr === "OneTimeProgress" ? colors.blue : "white",
              borderBottomWidth: 1,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            },
          ]}
        >
          <Text style={[tw` text-lg `]}>One Time Statistics</Text>
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
          name="DailyProgress"
          component={Daily}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="OneTimeProgress"
          component={OneTime}
          options={horizontalAnimation}
        />
      </Stack.Navigator>
      {/* <PieChart />
      <BezierChart /> */}
    </SafeAreaProvider>
  );
};

export default Statistics;
