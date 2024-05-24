import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { getDatabase } from "../database";
import { colors } from "../store";
import { Icon } from "react-native-elements";

const UnfinishedTasks = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getUnfinishedTasks = async () => {
      const db = getDatabase();
      if (db) {
        const allTasks = await db.getAllAsync(
          `SELECT * FROM rippleReminder WHERE expiry=DATE('now') and type='daily'`
        );
        const completedTasks = await db.getAllAsync(`
            SELECT * FROM ripplestatus WHERE expiry=DATE('now')
        `);
        const incompleteTasks = allTasks.filter(
          (task) =>
            !completedTasks.some(
              (completed) =>
                completed.taskId === task.taskId &&
                completed.status === "complete"
            )
        );
        setData(incompleteTasks);
      }
    };
    getUnfinishedTasks();
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ justifyContent: "center" }}
      style={{
        width: "100%",
      }}
    >
      <View style={[tw` mb-64`]}>
        <View style={tw` flex  px-2 py-4`}>
          <View style={[tw``]}>
            <Text style={[tw`text-lg`]}>Remaining tasks</Text>
            {data.map((item, index) => (
              <View
                key={index}
                style={[
                  tw`flex flex-row justify-between items-center py-3  rounded-xl shadow-xl my-2 px-2 `,
                  { backgroundColor: colors.blue },
                ]}
              >
                <View
                  style={[
                    tw`flex flex-row justify-center items-center`,
                    { width: "100%" },
                  ]}
                >
                  <Text style={[tw`text-2xl font-bold text-white`]}>
                    {item.taskHeading.length < 18
                      ? item.taskHeading
                      : `${item.taskHeading.substring(0, 18)}...`}
                  </Text>
                </View>
              </View>
            ))}
            {data.length === 0 && (
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
                  All tasks completed!
                </Text>
              </View>
            )}
          </View>
        </View>
        <View>
          <Text></Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default UnfinishedTasks;
