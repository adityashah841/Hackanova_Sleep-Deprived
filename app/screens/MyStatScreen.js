import React, { useState, useEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import SignInScreen from "./SignInScreen";
const moment = require('moment');
const today = moment();
import { v4 as uuidv4 } from 'uuid';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
  Alert,
  TextInput,
  ImageBackground
} from "react-native";

import {
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryAxis
} from "victory-native";
import { isFor } from "@babel/types";
import Calendar from '../src/components/Calendar';

export default function MyStatScreen(props) {
  const [countPlastic, setPlastic] = useState(0.4);
  const [countPaper, setPaper] = useState(0.3);
  const [countRest, setRest] = useState(0.9);
  const [ratio, setRatio] = useState(null);
  const [date, setDate] = useState("2023-01-21");

  [isLoggedOut, setIsLoggedOut] = useState(false);
  [isAchieved, setIsAchieved] = useState(false);
  [level, setLevel] = useState("bronze");

  const statuses = [
    { status: "ok", color: "#33CC66", key: 1 },
    { status: "disturbed", color: "yellow", key: 2 },
    { status: "down", color: "red", key: 3 }
  ];
  const [status, setStatus] = useState(statuses[0].status);

  const bagWeights = {
    plastic: 0.5,
    paper: 0.6,
    rest: 0.9
  };

  const data = [
    { type: "plastic", trashbags: countPlastic, fill: "#009245" },
    { type: "paper", trashbags: countPaper, fill: "#33CC66" },
    { type: "rest", trashbags: countRest, fill: "#66FF66" }
  ];

  const intialAchievements = {
    firstAchievement: {
      level: 1,
      message: "Amazing job",
      isAchieved: false,
      showDetails: false,
      details: "Just getting started",
      background: "#66FF66"
    },
    secondAchievement: {
      level: 2,
      message: "Wow, amazing job",
      isAchieved: false,
      showDetails: false,
      details: "On your way!",
      background: "#33CC66"
    },
    thirdAchievement: {
      level: 3,
      message: "I'm impressed!",
      isAchieved: false,
      showDetails: false,
      details: "Aiming high!",
      background: "#33CC66"
    },
    fourthAchievement: {
      level: 4,
      message: "Lets go champ!",
      isAchieved: false,
      showDetails: false,
      details: "On the top!",
      background: "#33CC66"
    }
  };

  const [achievements, setAchievements] = useState(intialAchievements);

  clearCounts = () => {
    setPlastic(0);
    setPaper(0);
    setRest(0);
  };

  checkIfAchievementUnlocked = () => {
    let achievement = {};
    let isAchieved = false;
    console.log(
      "check if achivement is unlocked",
      countPlastic,
      countPaper,
      countRest
    );
    if (countPlastic > 0 && countPaper > 0 && countRest > 0) {
      achievement = achievements.firstAchievement;

      if (achievement.isAchieved === false) {
        achievement.isAchieved = true;
        setAchievements(prevAchievements => ({
          ...prevAchievements,
          firstAchievement: achievement
        }));
        isAchieved = true;
      } else {
        isAchieved = false;
      }
    }

    if (countPlastic > 1 && countPaper > 1 && countRest > 1) {
      achievement = achievements.secondAchievement;

      if (achievement.isAchieved === false) {
        achievement.isAchieved = true;
        setAchievements(prevAchievements => ({
          ...prevAchievements,
          secondAchievement: achievement
        }));
        isAchieved = true;
      } else {
        isAchieved = false;
      }
    }

    if (countPlastic > 4 && countPaper > 4 && countRest > 4) {
      achievement = achievements.thirdAchievement;
      if (achievement.isAchieved === false) {
        achievement.isAchieved = true;
        setAchievements(prevAchievements => ({
          ...prevAchievements,
          thirdAchievement: achievement
        }));
        isAchieved = true;
      } else {
        isAchieved = false;
      }
    }

    if (countPlastic > 6 && countPaper > 6 && countRest > 6) {
      achievement = achievements.fourthAchievement;

      if (achievement.isAchieved === false) {
        achievement.isAchieved = true;
        if (achievement.isAchieved === false) {
          achievement.isAchieved = true;
          setAchievements(prevAchievements => ({
            ...prevAchievements,
            fourthAchievement: achievement
          }));
          isAchieved = true;
        } else {
          isAchieved = false;
        }
      }
    }

    return [isAchieved, achievement];
  };

  incrementTrash = typeOfTrash => {
    if (typeOfTrash === "plastic") {
      setPlastic(prevCountPlastic => (prevCountPlastic += bagWeights.plastic));
    } else if (typeOfTrash === "paper") {
      setPaper(prevCountPaper => (prevCountPaper += bagWeights.paper));
    } else if (typeOfTrash === "rest") {
      setRest(prevCountRest => (prevCountRest += bagWeights.rest));
    }

    setRatio(this.computeRatio());
  };

  computeRatio = () => {
    let newRatio =
      (countPlastic + countPaper) / (countRest + countPlastic + countPaper);
    console.log("newRatio", newRatio);

    return newRatio;
  };

  reportUpdatedStatus = newStatus => {
    console.log("send feedback to backend - status:", newStatus);
    console.log("determine if problem actually has occurred ");
    console.log("based on backend evaluation - request support");
  };

  updateStatus = newStatus => {
    reportUpdatedStatus(newStatus);
    setStatus(newStatus);
  };

  useEffect(() => {
    const [isAchievementUnlocked, achievement] = checkIfAchievementUnlocked();

    if (isAchievementUnlocked) {
      setIsAchieved(true);
      Alert.alert(
        "Level: " + "" + achievement.level,
        "Message: " + achievement.message,

        [
          {
            text: "OK",
            onPress: () => {
              setIsAchieved(false);
            }
          }
        ]
      );
      console.log("isAchived", isAchieved);
    }
  }, [countPlastic, countPaper, countRest]);

  useEffect(() => {
    if (ratio > 0 && ratio <= 0.15) {
      setLevel("bronze");
    } else if (ratio > 0.15 && ratio <= 0.3) {
      setLevel("silver");
    } else if (ratio > 0.3 && ratio <= 0.45) {
      setLevel("gold");
    } else if (ratio > 0.45) {
      setLevel("platinum");
    }
  }, [ratio]);




  const MyStatContent = (
    <ImageBackground
      // source={require("../assets/images/background-green.png")}
      style={{ width: "100%", height: "100%", color: '#333' }}
    >
      <View style={styles.container}>
        {isAchieved && <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} />}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View>
            {/* <View>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontFamily:
                  Platform.OS === "android" ? "Roboto" : "Helvetica Neue",
                paddingTop: 0,
                paddingLeft: 20,
                textDecorationLine: "underline"
              }}
            >
              Welcome User
            </Text>
          </View> */}

            <Calendar />


          </View>

          <View style={styles.throwThrashContainer}>
            <Text
              style={{
                color: "#000",
                fontSize: 20,
                width: "90%",
                fontFamily:
                  Platform.OS === "android" ? "Roboto" : "Helvetica Neue",
                paddingBottom: 10,
                paddingLeft: 20,
                fontWeight: "bold",

              }}
            >
              My thrown trash on {today.format("dddd, Do MMMM")}
            </Text>

            <Text
              style={{
                fontSize: 14,
                // paddingBottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                color: "#000",
                fontFamily:
                  Platform.OS === "android" ? "Roboto" : "Helvetica Neue"
                //color: "#6E6E6E"
              }}
            >
              To register thrown trash press the '+' for the correct trash type.
            </Text>
            <VictoryChart
              domainPadding={17}
              width={380}
              height={300}
              paddingRight={30}
            >
              <VictoryAxis
                style={{ axisLabel: { padding: 35 } }}
                dependentAxis
                label="kg"
              />
              <VictoryAxis />
              <VictoryBar
                animate={{ duration: 500, onStart: { duration: 1000 } }}
                style={{
                  data: {
                    fill: ({ datum }) => datum.fill,
                    stroke: "black",
                    strokeWidth: 1
                  }
                }}
                data={data}
                x="type"
                y="trashbags"
              />
            </VictoryChart>

            <View style={styles.buttonsContainer}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ paddingBottom: 5 }}>
                  <Image
                    style={{ marginTop: 5, width: 70, height: 70 }}
                    source={require("../assets/images/recycled-plastic-2.png")}
                  />
                </View>

                <TouchableHighlight
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    // backgroundColor: "#B8D2B9",
                    backgroundColor: "#009245",
                    flex: 1,

                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => incrementTrash("plastic")}
                >
                  <Text style={{ fontSize: 25 }}>+</Text>
                </TouchableHighlight>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ paddingBottom: 5 }}>
                  <Image
                    style={{ marginTop: 5, width: 60, height: 70 }}
                    source={require("../assets/images/recycled-paper-2.png")}
                  />
                </View>
                <TouchableHighlight
                  style={{
                    height: 20,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    // backgroundColor: "#B8D2B9",
                    backgroundColor: "#33CC66",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => incrementTrash("paper")}
                >
                  <Text style={{ fontSize: 25 }}>+</Text>
                </TouchableHighlight>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ paddingBottom: 5 }}>
                  <Image
                    style={{
                      marginTop: 5,
                      width: 80,
                      height: 50,
                      marginBottom: 10,
                      marginTop: 15
                    }}
                    source={require("../assets/images/recycled-rest-4.png")}
                  />
                </View>
                <TouchableHighlight
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    // backgroundColor: "#B8D2B9",
                    backgroundColor: "#66FF66",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => incrementTrash("rest")}
                >
                  <Text style={{ fontSize: 25 }}>+</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#B8D2B9",
              marginLeft: 20,
              marginRight: 20,
              marginTop: 10,
              borderRadius: 10
            }}
          >
            <View>
              <Text
                style={{
                  textAlign: "left",
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 10,
                  marginTop: 10
                }}
              >
                Press on the different time buttons to change the time frame for
                your thrown trash.
              </Text>
            </View>

            <View style={styles.dateContainer}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    backgroundColor: "white",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "black", textAlign: "center" }}>
                    Week
                  </Text>
                </TouchableHighlight>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    backgroundColor: "#33CC66",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Month
                  </Text>
                </TouchableHighlight>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{
                    height: 30,
                    width: 100,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    backgroundColor: "white",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "black", textAlign: "center" }}>
                    Year
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          <View style={styles.throwThrashContainer}>
            <Text
              style={{
                //color: "#6E6E6E",
                fontSize: 20,
                fontFamily:
                  Platform.OS === "android" ? "Roboto" : "Helvetica Neue",
                paddingBottom: 10,
                paddingLeft: 20,
                fontWeight: "bold",
                color: "#000"
              }}
            >
              My thrown trash distribution
            </Text>
            <View>
              <VictoryPie
                domainPadding={17}
                width={350}
                height={300}
                colorScale={["#009245", "#33CC66", "#66FF66"]}
                data={[
                  { x: "Plastic", y: countPlastic },
                  { x: "Compostable", y: countPaper },
                  { x: "Recyclable", y: countRest }
                ]}
              />
            </View>
          </View>

          <View style={styles.throwThrashContainerGreen}>
            <View>
              <Text
                style={{
                  //color: "#6E6E6E",
                  fontSize: 20,
                  fontFamily:
                    Platform.OS === "android" ? "Roboto" : "Helvetica Neue",
                  paddingBottom: 10,
                  paddingLeft: 20,
                  fontWeight: "bold"
                  ,
                  color: "#000"
                }}
              >
                My level
              </Text>
            </View>
            <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      level === "bronze"
                        ? "#A77044"
                        : level === "silver"
                          ? "#A7A7AD"
                          : level === "gold"
                            ? "#D6AF36"
                            : level === "platinum"
                              ? "#cbc7c5"
                              : "green"
                  }}
                >
                  <Text>{level} </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.throwThrashContainer}>
            <Text
              style={{
                //color: "#6E6E6E",
                fontSize: 20,
                fontFamily:
                  Platform.OS === "android" ? "Roboto" : "Helvetica Neue",
                paddingBottom: 10,
                paddingLeft: 20,
                fontWeight: "bold"
                , color: "#000"
              }}
            >
              My badges
            </Text>
            <View style={styles.statusContainer}>
              {Object.keys(achievements).map(
                achievementKey =>
                  achievements[achievementKey].isAchieved && (
                    <View style={styles.buttonContainer} key={achievements[achievementKey].key}>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <TouchableHighlight
                          style={{
                            borderRadius: 10,
                            borderWidth: 0.5,

                            // backgroundColor: "#B8D2B9",
                            backgroundColor: achievements[achievementKey]
                              .background
                              ? achievements[achievementKey].background
                              : "grey",
                            flex: 1,
                            padding: 15,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                          onPress={() => {
                            setAchievements(prevAchievements => ({
                              ...prevAchievements,
                              [achievementKey]: {
                                ...prevAchievements[achievementKey],
                                showDetails: !prevAchievements[achievementKey]
                                  .showDetails
                              }
                            }));
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "bold"
                              }}
                            >
                              {achievements[achievementKey].message}
                            </Text>
                            {achievements[achievementKey].showDetails && (
                              <View
                                style={{
                                  marginTop: 10,
                                  backgroundColor: "white",
                                  color: "black",
                                  borderRadius: 5,
                                  opacity: 0.9,
                                  padding: 15
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 15
                                  }}
                                >
                                  {achievements[achievementKey].details}
                                </Text>
                              </View>
                            )}
                          </View>
                        </TouchableHighlight>
                      </View>
                    </View>
                  )
              )}
            </View>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableHighlight
              onPress={() => {
                clearCounts();
                setIsLoggedOut(true);
              }}
              style={{
                // backgroundColor: "#B8D2B9",
                // borderWidth: 0.5,
                opacity: 1,
                backgroundColor: "#33CC66",
                borderRadius: 10,
                marginTop: 10,
                width: 375,
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end",
                marginBottom: 0,
                marginTop: 30
              }}
            >
              <Text style={{ color: "white", padding: 10 }}>Sign out</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View >
    </ImageBackground >
  );

  return isLoggedOut ? <SignInScreen /> : MyStatContent;
  // return MyStatContent;
}

SignInScreen.navigationOptions = {
  header: null
};


const styles = StyleSheet.create({
  container: {
    flex: 1
    //backgroundColor: "#B8D2B9"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  buttonsContainer: {
    padding: 10,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },

  buttonContainer: {
    padding: 5,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },

  statusContainer: {
    //backgroundColor: "#B8D2B9",
    marginTop: 10,
    color: "white",
    flex: 1,
    flexDirection: "row"
  },
  throwThrashContainer: {
    //backgroundColor: "#B8D2B9",
    backgroundColor: "white",
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    opacity: 0.9,
    paddingTop: 20,
    //paddingBottom: 20,
    //padding: 20,
    borderRadius: 10,
    marginTop: 10
  },
  throwThrashContainerGreen: {
    backgroundColor: "#B8D2B9",
    // backgroundColor: "white",
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    opacity: 0.9,
    paddingTop: 20,
    //paddingBottom: 20,
    //padding: 20,
    borderRadius: 10,
    marginTop: 10
  },
  dateContainer: {
    // backgroundColor: "white",
    // backgroundColor: "#B8D2B9",
    opacity: 0.9,
    //marginTop: 15,
    marginLeft: 10,
    marginRight: 5,
    paddingBottom: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10
  }
});
