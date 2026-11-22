import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
    name: 'VisionZ',
    slug: 'visionz-mobile',
    version: '1.0.0',
    scheme: 'visionz',
    orientation: 'portrait',
    android: {
        package: 'com.visionz.aicamera',
        permissions: [
            'android.permission.CAMERA',
            'android.permission.RECORD_AUDIO',
            'android.permission.READ_MEDIA_IMAGES',
        ],
    },
    plugins: [
        'expo-router',
        [
            'react-native-vision-camera',
            {
                cameraPermissionText: 'AI ক্যামেরা ও ব্যাকগ্রাউন্ড এডিটিংয়ের জন্য ক্যামেরা পারমিশন প্রয়োজন।',
                enableMicrophonePermission: true,
                microphonePermissionText: 'ভয়েস কমান্ডের জন্য মাইক্রোফোন পারমিশন প্রয়োজন।',
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    compileSdkVersion: 37,
                    targetSdkVersion: 35,
                    minSdkVersion: 24,
                    enableProguardInReleaseBuilds: true,
                    enableShrinkResourcesInReleaseBuilds: true,
                    useLegacyPackaging: false,
                },
            },
        ],
        [
            'react-native-google-mobile-ads',
            {
                androidAppId: 'ca-app-pub-3940256099942544~3347511713',
            },
        ],
        [
            'expo-speech-recognition',
            {
                microphonePermission: 'ভয়েস কমান্ডের মাধ্যমে ক্যামেরা নিয়ন্ত্রণের জন্য মাইক্রোফোন পারমিশন প্রয়োজন।',
                speechRecognitionPermission: 'ভয়েস কমান্ড শনাক্ত করার জন্য স্পিচ রিকগনিশন পারমিশন প্রয়োজন।',
            },
        ],
    ],
};

export default config;