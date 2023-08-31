import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Clipboard,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


function App() {
  const [password, setPassword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [PasswordText, setPasswordText] = useState({ color: "red" });
  const [fadeAnim] = useState(new Animated.Value(0));

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  const handleInputValue = (value) => {
    if (/^\d+$/.test(value) || value === "") {
      setInputValue(value);
      setPasswordText({ color: "green" });
    }
  };

  const handlePassword = async () => {
    if (!inputValue || isNaN(inputValue)) {
      console.error("Invalid input value.");
      return;
    }

    const passwordLength = parseInt(inputValue, 10);
    let newPassword = "";

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters[randomIndex];
    }

    try {
      await AsyncStorage.setItem("generatedPassword", newPassword);
      setPassword(newPassword);

      Clipboard.setString(newPassword);
    } catch (error) {
      console.error("Error saving password:", error);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [password, fadeAnim]);

  let styles = StyleSheet.create({
    parent: {
      height: "100%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    animatedContainer: {
      opacity: fadeAnim,
    },
    btn: {
      marginTop: 20,
      fontSize: 30,
    },
    password: {
      fontSize: 30,
      marginTop: 20,
    },
    input: {
      backgroundColor: "transparent",
      height: "8%",
      width: "50%",
      padding: 10,
      marginBottom: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "green",
    },
  });

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>
        Type length for <Text style={PasswordText}>password</Text>{" "}
      </Text>
      <TextInput
        value={inputValue}
        onChangeText={handleInputValue}
        placeholder="Type length for Password"
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Generate" style={styles.btn} onPress={handlePassword} />
      <Animated.Text style={[styles.password, { opacity: fadeAnim }]}>
        {password || "Generate Password"}
      </Animated.Text>
    </View>
  );
}

export default App;
