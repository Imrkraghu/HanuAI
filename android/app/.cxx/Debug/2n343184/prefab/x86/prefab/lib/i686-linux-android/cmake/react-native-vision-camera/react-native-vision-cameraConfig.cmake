if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/home/admin1/Documents/hanuai/node_modules/react-native-vision-camera/android/build/intermediates/cxx/Debug/313d6u6b/obj/x86/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/admin1/Documents/hanuai/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

