import { registerRootComponent } from "expo";

import App from "./App/App";
//import App from "./App/pages/home/home.js";
//import App from "./App/pages/config/config.js";
//import App from "./App/pages/notifications/notifications.js";
//import App from "./App/pages/profile/profile.js";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
