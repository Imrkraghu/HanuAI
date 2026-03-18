if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "/home/admin1/Documents/hanuai/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/4u7157t5/obj/armeabi-v7a/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/admin1/Documents/hanuai/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

