package com.carmarkets

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "CarMarkets"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  //react-native-screens override
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null);
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    
    // Handle widget configuration result
    if (requestCode == WIDGET_CONFIG_REQUEST_CODE) {
      if (resultCode == Activity.RESULT_OK) {
        // Widget was added successfully
        android.util.Log.d("MainActivity", "Widget added successfully")
      } else {
        // Widget addition was cancelled
        android.util.Log.d("MainActivity", "Widget addition cancelled")
      }
    }
  }

  companion object {
    private const val WIDGET_CONFIG_REQUEST_CODE = 1001
  }
}
