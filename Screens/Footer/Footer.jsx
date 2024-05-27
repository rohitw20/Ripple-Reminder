import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { colors, footerScreen } from "../../store";
import { Icon } from "react-native-elements";

const Footer = () => {
  const navigation = useNavigation();
  const [curr, setCurr] = useAtom(footerScreen);
  return (
    <View>
      <View
        style={[
          tw`flex flex-row justify-between px-4 py-2 bg-white`,
          { borderTopWidth: 1, borderTopColor: "rgb(229 231 235)" },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DashboardScreen");
            setCurr("DashboardScreen");
          }}
        >
          <Icon
            name="home"
            type="ionicon"
            color={curr === "DashboardScreen" ? colors.blue : "black"}
            size={25}
          />
          <Text
            style={[
              tw`text-base font-semibold `,
              { color: curr === "DashboardScreen" ? colors.blue : "black" },
            ]}
          >
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurr("StatisticsScreen");
            navigation.navigate("StatisticsScreen");
          }}
        >
          <Icon
            name="aperture"
            type="ionicon"
            color={curr === "StatisticsScreen" ? colors.blue : "black"}
            size={25}
          />
          <Text
            style={[
              tw`text-base font-semibold `,
              { color: curr === "StatisticsScreen" ? colors.blue : "black" },
            ]}
          >
            Statistics
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          tw`absolute w-full py-1 bottom-20 px-2  flex flex-row justify-end`,
          ,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setCurr("TaskOperationScreen");
            navigation.navigate("TaskOperationScreen");
          }}
          style={[
            tw` rounded-full p-2 flex items-center justify-center shadow-md`,
            {
              backgroundColor: colors.green,
              borderColor: curr === "TaskOperationScreen" ? colors.blue : "",
              borderWidth: curr === "TaskOperationScreen" ? 2 : 0,
            },
          ]}
        >
          <Icon name="add" type="ionicon" color="white" size={40} />
          {/* <Text
          style={[
            tw`text-lg font-semibold `,
            { color: curr === "TaskOperationScreen" ? colors.blue : "black" },
          ]}
        >
          Create Task
        </Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
