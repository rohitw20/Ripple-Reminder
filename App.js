import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Dasahboard from "./Screens/Dashboard/Dasahboard";
import Statistics from "./Screens/Statistics/Statistics";
import Footer from "./Screens/Footer/Footer";
import TaskOperation from "./Screens/Dashboard/Screens/TaskOperation/TaskOperation";
import tw from "tailwind-react-native-classnames";
import {
  colors,
  day,
  footerScreen,
  month,
  months,
  todayDate,
  year,
} from "./store";
import { getDatabase, initDatabase } from "./database";
import Calender from "./Screens/Dashboard/Screens/Calender/Calender";
import { useAtom } from "jotai";
import ViewTask from "./Screens/Dashboard/Screens/ViewTask/ViewTask";

const App = () => {
  const Stack = createStackNavigator();

  const [screen, _] = useAtom(footerScreen);

  useEffect(() => {
    const initializeDb = async () => {
      await initDatabase();

      const db = getDatabase();

      const result = await db.getAllAsync(`SELECT * FROM dateKeeper`);
      const prevDate = result[0]?.dailyDate || todayDate;
      // await db.runAsync(`UPDATE datekeeper set dailydate=?`, "2024-05-24");
      // console.log(prevDate);
      if (todayDate > prevDate) {
        const allTasks = await db.getAllAsync(
          `SELECT * FROM rippleReminder WHERE expiry=(?) and isDeleted=0`,
          [prevDate]
        );

        const completedTasks = await db.getAllAsync(
          `
          SELECT * FROM ripplestatus WHERE expiry=(?)
        `,
          prevDate
        );
        const incompleteTasks = allTasks.filter(
          (task) =>
            !completedTasks.some(
              (completed) =>
                completed.taskId === task.taskId &&
                completed.status === "complete"
            )
        );
        // console.log(incompleteTasks);
        for (const item of incompleteTasks) {
          await db.runAsync(
            `INSERT INTO ripplestatus (taskId, status, expiry) VALUES(?, ?, ?)`,
            [item.taskId, "expired", prevDate]
          );
        }
        await db.runAsync(
          `UPDATE ONETIME SET STATUS='expired' WHERE EXPIRY=? AND ISDELETED=0 AND STATUS<>'complete'`,
          prevDate
        );
        for (const item of allTasks) {
          await db.runAsync(`UPDATE rippleReminder set expiry=? `, [todayDate]);
        }

        await db.runAsync(`UPDATE datekeeper set dailydate=?`, todayDate);
      }

      // console.log(await db.getAllAsync(`select * from datekeeper`));

      // const asdf = await db.getAllAsync(
      //   `SELECT * FROM ripplereminder where expiry=?`,
      //   prevDate
      // );
      // const bsdf = await db.getAllAsync(
      //   `SELECT * FROM ripplestatus where expiry=?`,
      //   prevDate
      // );
      // const csdf = await db.getAllAsync(
      //   `SELECT * FROM onetime where expiry=?`,
      //   prevDate
      // );
      // console.log(asdf, bsdf, csdf);
      // await db.execAsync(`DROP TABLE rippleReminder`);
      // await db.execAsync(`DROP TABLE onetime`);
      // await db.execAsync(`DROP TABLE ripplestatus`);
      // await db.execAsync(`DROP TABLE dateKeeper`);
    };

    initializeDb();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView
          style={{
            backgroundColor:
              screen === "DashboardScreen" ? colors.blue : "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/*<View style={[tw`py-4 flex px-5 `, { backgroundColor: colors.blue }]}>
            <Text style={tw`text-white font-bold text-2xl`}>
              Ripple Reminder
            </Text>
          </View>
          <View style={[tw`px-2 py-2 flex flex-row items-center`]}>
            <Text style={[tw`font-bold text-xl`, { color: "white" }]}>
              {day}, {months[month - 1]}
            </Text>
            <Text style={[tw`font-bold text-3xl`, { color: "white" }]}>
              {" "}
              {year}
            </Text>
          </View>*/}
        </SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="DashboardScreen"
              component={Dasahboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StatisticsScreen"
              component={Statistics}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CalenderScreen"
              component={Calender}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewTaskScreen"
              component={ViewTask}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskOperationScreen"
              component={TaskOperation}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </KeyboardAvoidingView>
        <Footer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
