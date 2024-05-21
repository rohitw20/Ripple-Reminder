import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { CheckBox, Icon } from "react-native-elements";
import { colors, taskId, tasks } from "../store";
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

  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const todayDate = `${year}-${month}-${day}`;

  const navigation = useNavigation();

  const handleComplete = async () => {
    if (db) {
      await db.runAsync(
        `INSERT INTO ripplestatus (taskId, status, expiry) VALUES(?, ?, ?)`,
        [data.taskId, "complete", todayDate]
      );
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
          tw`flex flex-row justify-between items-center py-2 w-full rounded-xl shadow-xl my-2 px-2`,
          { backgroundColor: colors.blue },
        ]}
        onLongPress={handleDeleteTask}
        onPress={() => {
          setId(data.taskId);
          navigation.navigate("ViewTaskScreen");
        }}
      >
        <View
          style={[
            tw`flex flex-row justify-start items-center`,
            { width: "100%" },
          ]}
        >
          <CheckBox
            disabled={completed ? true : false}
            checked={completed}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor={colors.green}
            size={50}
            uncheckedColor="white"
            aria-checked
            iconRight={false}
          />
          <View>
            <Text style={[tw`text-2xl font-bold text-white`]}>
              {data.taskHeading.length < 18
                ? data.taskHeading
                : `${data.taskHeading.substring(0, 18)}...`}
            </Text>

            <Text style={[tw`text-sm text-white`]}>
              Expiry: {data.type === "oneTime" ? data.expiry : "Today"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;
