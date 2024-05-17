import React from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Dasahboard from "./Screens/Dashboard/Dasahboard";
import Statistics from "./Screens/Statistics/Statistics";
import Footer from "./Screens/Footer/Footer";
import TaskOperation from "./Screens/Dashboard/Screens/TaskOperation/TaskOperation";
import tw from "tailwind-react-native-classnames";
import { colors, months } from "./store";

const App = () => {
  const Stack = createStackNavigator();

  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1);
  const year = today.getFullYear();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView
          style={{
            backgroundColor: colors.blue,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={[tw`py-4 flex px-5 `, { backgroundColor: colors.blue }]}>
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
          </View>
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
