import React from "react";
import { View, Text, Image } from "react-native";

export default() => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
            }}
        >
            <Image
                source={require("@/assets/images/signin/logo-voluntariei.png")}
                style={{ width: 180, height: 180, resizeMode: "contain" }}
            />
            <Text
                style={{
                    position: "absolute",
                    bottom: 40,
                    color: "#173663",
                    fontSize: 14,
                    fontFamily: "System",
                }}
            >
                Carregando esperança...
            </Text>
        </View>
    );
}
