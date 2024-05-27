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

const TaskCard = ({ data, type }) => {
  const [topic, setTopic] = useAtom(tasks);
  const [completed, setCompleted] = useState(data.status === "complete");
  const [id, setId] = useAtom(taskId);

  const db = getDatabase();

  const navigation = useNavigation();

  const handleComplete = async () => {
    if (db) {
      if (type === "daily") {
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
      } else {
        db.runAsync(`UPDATE ONETIME SET STATUS=? WHERE TASKID=?`, [
          data.status === "complete" ? "incomplete" : "complete",
          data.taskId,
        ]);
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
      if (type === "daily") {
        await db.runAsync(
          `update ripplereminder set isdeleted=1 where taskId=?`,
          data.taskId
        );
      } else {
        await db.runAsync(
          `update onetime set isdeleted=1 where taskId=?`,
          data.taskId
        );
      }
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
          tw`flex flex-row justify-between items-center py-2 w-full rounded-md shadow-xl my-1 px-2`,
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
            tw`flex flex-row justify-start pl-2 items-center`,
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
          <Text style={[tw`text-base text-white pb-2`, { fontWeight: "500" }]}>
            {data.taskHeading.length < 30
              ? data.taskHeading
              : `${data.taskHeading.substring(0, 30)}...`}
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
