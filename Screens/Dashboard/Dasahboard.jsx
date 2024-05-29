import React, { useCallback, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import tw from "tailwind-react-native-classnames";
import { useAtom } from "jotai";
import {
  colors,
  currentScreen,
  day,
  footerScreen,
  month,
  months,
  oneTimeTasks,
  tasks,
  todayDate,
  year,
} from "../../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getDatabase } from "../../database";
import { getAllTasks } from "../../queries";
import { Image } from "react-native-elements";

const Dasahboard = () => {
  const Stack = createStackNavigator();
  const [screenName, setScreenName] = useAtom(currentScreen);
  const navigator = useNavigation();

  const [footerScreenName, setFooterScreenName] = useAtom(footerScreen);
  const [topics, setTopics] = useAtom(tasks);
  const [oneTime, setOneTime] = useAtom(oneTimeTasks);

  useFocusEffect(() => setFooterScreenName("DashboardScreen"));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchReminders = async () => {
        const db = getDatabase();
        if (db) {
          let result = [];
          const data = await db.getAllAsync(
            `SELECT * FROM rippleReminder WHERE expiry = DATE('now') and isdeleted=0`
          );
          const oneTimeData = await db.getAllAsync(
            `SELECT * FROM onetime WHERE expiry = DATE('now') and isdeleted=0`
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
            setOneTime(oneTimeData);
          }
        }
      };

      fetchReminders();

      return () => {
        isActive = false;
      };
    }, [topics, oneTime])
  );

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <SafeAreaView
        style={{
          backgroundColor: colors.blue,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={[
            tw`py-4 flex flex-row items-center `,
            { backgroundColor: colors.blue },
          ]}
        >
          <Image
            source={require("../../assets/logo.png")}
            alt="logo"
            // width={5}
            // height={5}
            style={[tw` w-11 h-11 mr-1 rounded-full `]}
          />
          <Text style={tw`text-white font-bold text-2xl`}>Daily TikTik</Text>
        </View>
        <View style={[tw`px-2 py-2 flex flex-row items-center`]}>
          <Text style={[tw`font-bold text-xl`, { color: "white" }]}>
            {day}, {months[month - 1]}
          </Text>
          <Text style={[tw`font-bold text-3xl`, { color: "white" }]}>
            {" "}
            {year}
          </Text>
        </View>
      </SafeAreaView>
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
            tw` py-2  w-1/2 flex justify-center items-center`,
            {
              backgroundColor:
                screenName === "DailyTasksScreen" ? colors.green : "white",
              borderColor:
                screenName === "DailyTasksScreen"
                  ? colors.green
                  : "rgb(209 213 219)",
              borderBottomWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 0,
            },
          ]}
        >
          <Text
            style={tw` ${
              screenName === "DailyTasksScreen" && "text-white"
            } font-semibold text-lg`}
          >
            Daily Tik
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setScreenName("OneTimeTasksScreen");
            navigator.navigate("OneTimeTasksScreen");
          }}
          style={[
            tw` py-2  w-1/2 flex justify-center items-center`,
            {
              backgroundColor:
                screenName === "OneTimeTasksScreen" ? colors.green : "white",
              borderBottomColor:
                screenName === "OneTimeTasksScreen"
                  ? colors.green
                  : "rgb(209 213 219)",
              borderBottomWidth: 1,
              borderRightWidth: 0,
              borderTopWidth: 0,
            },
          ]}
        >
          <Text
            style={tw` ${
              screenName === "OneTimeTasksScreen" && "text-white"
            } font-semibold text-lg`}
          >
            Scheduled Tik
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
