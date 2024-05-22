import React, { useCallback, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import {
  colors,
  currentScreen,
  footerScreen,
  tasks,
  todayDate,
} from "../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getDatabase } from "../../database";
import { getAllTasks } from "../../queries";

const Dasahboard = () => {
  const Stack = createStackNavigator();
  const [screenName, setScreenName] = useAtom(currentScreen);
  const navigator = useNavigation();

  const [footerScreenName, setFooterScreenName] = useAtom(footerScreen);
  const [topics, setTopics] = useAtom(tasks);

  useFocusEffect(() => setFooterScreenName("DashboardScreen"));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchReminders = async () => {
        const db = getDatabase();
        if (db) {
          let result = [];
          const data = await db.getAllAsync(
            `SELECT * FROM rippleReminder WHERE expiry >= DATE('now')`
          );

          for (const item of data) {
            const currentData = { ...item };
            const newData = await db.getAllAsync(
              `SELECT * FROM ripplestatus WHERE taskId =? and expiry>=?`,
              [item.taskId, todayDate]
            );
            currentData.status = newData[0]?.status || "incomplete";
            result.push(currentData);
          }

          if (isActive) {
            setTopics(result);
          }
        }
      };

      fetchReminders();

      return () => {
        isActive = false;
      };
    }, [topics])
  );

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <View
        style={[
          tw`flex flex-row justify-between items-center bg-white shadow-md`,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setScreenName("DailyTasksScreen");
            navigator.navigate("DailyTasksScreen");
          }}
          style={[
            tw` py-4 border border-gray-200 w-1/2 flex justify-center items-center`,
            {
              backgroundColor:
                screenName === "DailyTasksScreen" ? colors.green : "white",
            },
          ]}
        >
          <Text
            style={tw` ${
              screenName === "DailyTasksScreen" && "text-white"
            } font-bold text-xl`}
          >
            Daily Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setScreenName("OneTimeTasksScreen");
            navigator.navigate("OneTimeTasksScreen");
          }}
          style={[
            tw` py-4 border border-gray-200 w-1/2 flex justify-center items-center`,
            {
              backgroundColor:
                screenName === "OneTimeTasksScreen" ? colors.green : "white",
            },
          ]}
        >
          <Text
            style={tw` ${
              screenName === "OneTimeTasksScreen" && "text-white"
            } font-bold text-xl`}
          >
            One Time Tasks
          </Text>
        </TouchableOpacity>
      </View>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default Dasahboard;
