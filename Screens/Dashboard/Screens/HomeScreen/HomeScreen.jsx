import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import DailyTasks from "../DailyTasks/DailyTasks";
import OneTimeTasks from "../OneTimeTasks/OneTimeTasks";
import tw from "tailwind-react-native-classnames";
import ViewTask from "../ViewTask/ViewTask";

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

const HomeScreen = () => {
  const Stack = createStackNavigator();
  return (
    <View style={tw`bg-white h-full justify-between `}>
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
          name="DailyTasksScreen"
          component={DailyTasks}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="OneTimeTasksScreen"
          component={OneTimeTasks}
          options={horizontalAnimation}
        />
      </Stack.Navigator>
    </View>
  );
};

export default HomeScreen;
