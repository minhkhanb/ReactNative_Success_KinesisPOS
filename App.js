import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { AppLoading, Asset, Font } from 'expo';

import store from './app/store';

import I18n from './app/common/utils/languageHelper';
import AppNavigatorService from './app/services/navigator/AppNavigatorService';
import ImageConstant from './app/common/constants/image';
import FontType from './app/common/constants/font';

import Login from './app/container/login';
import Setting from './app/container/setting';

// Init navigation slack for app
const MainNavigator = createStackNavigator({
  // Login: {
  //   screen: Login,
  // },
  Setting: {
    screen: Setting,
  },
}, {
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false,
  },
});

class App extends Component {
  state = {
    isReady: false,
  }

  componentWillMount() {
    I18n.initAsync();
  }

  cacheImages = (images) => {
    return images.map((image) => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      }
      return Asset.fromModule(image).downloadAsync();
    });
  };

  cacheFonts = (fonts) => {
    return fonts.map(font => Font.loadAsync(font));
  }

  loadResourcesAsync = async () => {
    return Promise.all([
      ...this.cacheImages([...ImageConstant]),
      ...this.cacheFonts([
        ...FontType,
      ]),
    ]);
  }

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isReady: true });
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={this.handleFinishLoading}
          onError={this.handleLoadingError}
        />
      );
    }

    return (
      <Provider store={store}>
        <MainNavigator
          ref={(navigatorRef) => {
            AppNavigatorService.setContainer(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}

export default App;
