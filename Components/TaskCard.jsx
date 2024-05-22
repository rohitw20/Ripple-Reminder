import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { CheckBox, Icon } from "react-native-elements";
import { colors, taskId, tasks, todayDate } from "../store";
import { TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { getDatabase } from "../database";
import { deleteCreatedTask } from "../queries";

const TaskCard = ({ data }) => {
  const [topic, setTopic] = useAtom(tasks);
  const [completed, setCompleted] = useState(data.status === "complete");
  const [id, setId] = useAtom(taskId);

  const db = getDatabase();

  const navigation = useNavigation();

  const handleComplete = async () => {
    if (db) {
      const result = await db.getAllAsync(
        `SELECT * FROM ripplestatus where expiry=? and taskId=?`,
        [todayDate, data.taskId]
      );
      if (result.length > 0) {
        await db.runAsync(
          `DELETE FROM ripplestatus WHERE expiry=? and taskId=?`,
          [todayDate, data.taskId]
        );
      } else {
        await db.runAsync(
          `INSERT INTO ripplestatus (taskId, status, expiry) VALUES(?, ?, ?)`,
          [data.taskId, "complete", todayDate]
        );
      }
    }
  };

  const toggleCheckbox = () => {
    // if (db) {
    // const result = await db.runAsync(
    //   `UPDATE rippleReminder set status=? where taskId=?`,
    //   [data.status === "complete" ? "incomplete" : "complete", data.taskId]
    // );
    // }
    Alert.alert("Mark this task as complete ?", "", [
      {
        text: "No",
        style: "cancel",
      },
      { text: "Yes", onPress: handleComplete },
    ]);
  };

  const handleDelete = async () => {
    if (db) {
      await db.runAsync(deleteCreatedTask, data.taskId);
    }
  };

  const handleDeleteTask = () => {
    Alert.alert("Do you want to delete the task ?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: handleDelete },
    ]);
  };

  return (
    <View style={tw` flex justify-center items-center w-full px-2`}>
      <TouchableOpacity
        style={[
          tw`flex flex-row justify-between items-center py-3 w-full rounded-xl shadow-xl my-2 px-2`,
          {
            backgroundColor:
              data.status === "complete" ? colors.green : colors.blue,
          },
        ]}
        onLongPress={handleDeleteTask}
        onPress={() => {
          setId(data.taskId);
          handleComplete();
          // navigation.navigate("ViewTaskScreen");
        }}
      >
        <View
          style={[
            tw`flex flex-row justify-center items-center`,
            { width: "100%" },
          ]}
        >
          {/* <CheckBox
            disabled={completed ? true : false}
            checked={completed}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={colors.green}
            size={40}
            uncheckedColor="white"
            aria-checked
            iconRight={false}
          /> */}
          {/* <View style={[tw`flex`, { gap: 5 }]}> */}
          <Text style={[tw`text-2xl font-bold text-white`]}>
            {data.taskHeading.length < 18
              ? data.taskHeading
              : `${data.taskHeading.substring(0, 18)}...`}
          </Text>
          {/* <View style={[tw`flex flex-row items-center `]}>
              <Icon
                name="calendar-outline"
                type="ionicon"
                size={20}
                color={"white"}
              />
              <Text style={[tw`text-sm text-white`]}>
                {" "}
                Due: {data.type === "oneTime" ? data.expiry : "Today"}
              </Text>
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;
