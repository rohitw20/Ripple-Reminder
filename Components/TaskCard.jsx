import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { CheckBox, Icon } from "react-native-elements";
import { colors, taskId, tasks } from "../store";
import { TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";

const TaskCard = ({ data }) => {
  const [topic, setTopic] = useAtom(tasks);
  const [completed, setCompleted] = useState(data.status === "complete");
  const [id, setId] = useAtom(taskId);

  const navigation = useNavigation();

  const toggleCheckbox = () => {
    setTopic((prevTasks) =>
      prevTasks.map((task) =>
        task.id === data.id
          ? {
              ...task,
              status: data.status === "complete" ? "incomplete" : "complete",
            }
          : task
      )
    );
    if (data.status === "incomplete") {
      Alert.alert("Task Completed!", data.taskHeading);
    }
  };
  return (
    <View style={tw` flex justify-center items-center w-full px-2`}>
      <TouchableOpacity
        style={[
          tw`flex flex-row justify-between items-center py-2 w-full rounded-xl shadow-xl my-2 px-2`,
          { backgroundColor: colors.blue },
        ]}
        onPress={() => {
          setId(data.id);
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
