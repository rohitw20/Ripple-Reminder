import React, { useEffect } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import Styles from "../../../../Styles";
import tw from "tailwind-react-native-classnames";
import TaskCard from "../../../../Components/TaskCard";
import { useFocusEffect } from "@react-navigation/native";
import { useAtom } from "jotai";
import { colors, currentScreen, tasks } from "../../../../store";
import { Icon } from "react-native-elements";

const OneTimeTasks = () => {
  const [screenName, setScreenName] = useAtom(currentScreen);
  const [topics, _] = useAtom(tasks);

  useFocusEffect(() => {
    setScreenName("OneTimeTasksScreen");
  });
  useEffect(() => {}, [topics]);
  return (
    <View style={[Styles.container, tw`flex items-center w-full mb-1`]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "center" }}
        style={{
          width: "100%",
        }}
      >
        <View style={[tw`px-2`]}>
          <Text style={[tw`my-5 text-2xl font-medium`]}>Incomplete Tasks</Text>
          {topics
            .filter(
              (item) => item.status === "incomplete" && item.type === "oneTime"
            )
            .map((item, index) => (
              <TaskCard key={index} data={item} />
            ))}
          {topics.filter(
            (item) => item.status === "incomplete" && item.type === "oneTime"
          ).length === 0 && (
            <View
              style={[tw`flex items-center justify-center py-4 bg-gray-100`]}
            >
              <Icon
                name="calendar-outline"
                type="ionicon"
                size={100}
                color={"gray"}
              />
              <Text style={[tw`text-3xl`, { color: "gray" }]}>
                No more task left
              </Text>
            </View>
          )}
        </View>
        <View style={[tw` my-5 px-2`]}>
          <Text style={[tw`my-5 text-2xl font-medium`]}>Completed Tasks</Text>
          {topics
            .filter(
              (item) => item.status === "complete" && item.type === "oneTime"
            )
            .map((item, index) => (
              <TaskCard key={index} data={item} />
            ))}
          {topics.filter(
            (item) => item.status === "complete" && item.type === "oneTime"
          ).length === 0 && (
            <View
              style={[tw`flex items-center justify-center py-4 bg-gray-100`]}
            >
              <Icon
                name="calendar-outline"
                type="ionicon"
                size={100}
                color={"gray"}
              />
              <Text style={[tw`text-3xl`, { color: "gray" }]}>
                No tasks completed yet!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OneTimeTasks;
