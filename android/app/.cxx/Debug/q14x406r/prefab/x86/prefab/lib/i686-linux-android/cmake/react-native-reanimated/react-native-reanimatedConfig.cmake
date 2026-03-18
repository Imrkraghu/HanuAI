if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "/home/admin1/Documents/hanuai/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/1f3h33lu/obj/x86/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/admin1/Documents/hanuai/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

