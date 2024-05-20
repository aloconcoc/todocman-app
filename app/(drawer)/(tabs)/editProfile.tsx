import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
    return (
                  <SafeAreaView
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      paddingHorizontal: 22,
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
            
              
                      <Text style={{ fontSize: 20 }}>Edit Profile</Text>
                    </View>
              
                    <ScrollView>
                      <View
                        style={{
                          alignItems: "center",
                          marginVertical: 22,
                        }}
                      >
                        <TouchableOpacity>
                          <Image
                            source={{ uri: 'https://i.pinimg.com/736x/37/13/dd/3713dd65b98585b54fa5576d9f37ef0e.jpg' }}
                            style={{
                              height: 170,
                              width: 170,
                              borderRadius: 85,
                              borderWidth: 1,
                              borderColor: 'gray',
                            }}
                          />
              
                          <View
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 10,
                              zIndex: 9999,
                            }}
                          >
                            <MaterialIcons
                              name="photo-camera"
                              size={32}
                              color={'gray'}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
              
                      <View>
                        <View
                          style={{
                            flexDirection: "column",
                            marginBottom: 6,
                          }}
                        >
                          <Text style={{ fontSize: 10 }}>Name</Text>
                          <View
                            style={{
                              height: 44,
                              width: "100%",
                              borderColor: 'gray',
                              borderWidth: 1,
                              borderRadius: 4,
                              marginVertical: 6,
                              justifyContent: "center",
                              paddingLeft: 8,
                            }}
                          >
                            <TextInput
                              value={'tudeptrai'}
                              editable={true}
                            />
                          </View>
                        </View>
              
                        <View
                          style={{
                            flexDirection: "column",
                            marginBottom: 6,
                          }}
                        >
                          <Text style={{ fonrSize: 10 }}>Email</Text>
                          <View
                            style={{
                              height: 44,
                              width: "100%",
                              borderColor: 'gray',
                              borderWidth: 1,
                              borderRadius: 4,
                              marginVertical: 6,
                              justifyContent: "center",
                              paddingLeft: 8,
                            }}
                          >
                            <TextInput
                              value={'email@gmail.com'}
                              editable={true}
                            />
                          </View>
                        </View>
              
                        <View
                          style={{
                            flexDirection: "column",
                            marginBottom: 6,
                          }}
                        >
                          <Text style={{ fonstSize: 10 }}>Password</Text>
                          <View
                            style={{
                              height: 44,
                              width: "100%",
                              borderColor: 'gray',
                              borderWidth: 1,
                              borderRadius: 4,
                              marginVertical: 6,
                              justifyContent: "center",
                              paddingLeft: 8,
                            }}
                          >
                            <TextInput
                              value={'password'}
                              editable={true}
                              secureTextEntry
                            />
                          </View>
                        </View>
              
                        <View
                          style={{
                            flexDirection: "column",
                            marginBottom: 6,
                          }}
                        >
                          <Text style={{ fonstSize: 10 }}>Date or Birth</Text>
                          <TouchableOpacity
                            style={{
                              height: 44,
                              width: "100%",
                              borderColor: 'gray',
                              borderWidth: 1,
                              borderRadius: 4,
                              marginVertical: 6,
                              justifyContent: "center",
                              paddingLeft: 8,
                            }}
                          >
                            <Text>20/05/2024</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
              
                      <View
                        style={{
                          flexDirection: "column",
                          marginBottom: 6,
                        }}
                      >
                        <Text style={{ fonstSize: 10 }}>Country</Text>
                        <View
                          style={{
                            height: 44,
                            width: "100%",
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 4,
                            marginVertical: 6,
                            justifyContent: "center",
                            paddingLeft: 8,
                          }}
                        >
                          <TextInput
                            value={'Viet Nam'}
                            editable={true}
                          />
                        </View>
                      </View>
              
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'green',
                          height: 44,
                          borderRadius: 6,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fonstSize: 20,
                            color: 'white',
                          }}
                        >
                          Save Change
                        </Text>
                      </TouchableOpacity>
              
                    </ScrollView>
                  </SafeAreaView>
                );
              
                
            
    
}
export default EditProfile