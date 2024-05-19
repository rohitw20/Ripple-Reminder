import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import { colors, currentScreen, footerScreen, tasks } from "../../store";
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

  useFocusEffect(() => {
    const fetchReminders = async () => {
      const db = getDatabase();
      if (db) {
        const result = await db.getAllAsync(getAllTasks);
        setTopics(result);
      }
    };

    fetchReminders();
  });

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
