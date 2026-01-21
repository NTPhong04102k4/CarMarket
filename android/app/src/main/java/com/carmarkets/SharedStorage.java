package com.carmarkets;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

public class SharedStorage extends ReactContextBaseJavaModule {
    ReactApplicationContext context;

    public SharedStorage(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "SharedStorage";
    }

    @ReactMethod
    public void set(String message) {
        android.util.Log.d("SharedStorage", "Setting appData: " + message);
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        editor.putString("appData", message);
        editor.commit();
        android.util.Log.d("SharedStorage", "Data saved to SharedPreferences");

        // Force update widget immediately
        Intent intent = new Intent(context.getApplicationContext(), CarMarketsWidget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] ids = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext())
                .getAppWidgetIds(
                        new ComponentName(getCurrentActivity().getApplicationContext(), CarMarketsWidget.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        getCurrentActivity().getApplicationContext().sendBroadcast(intent);
        android.util.Log.d("SharedStorage", "Broadcast sent to update widget");

    }

    @ReactMethod
    public void get(com.facebook.react.bridge.Callback callback) {
        SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        String appData = sharedPref.getString("appData", "{\"text\":\"no data\"}");
        android.util.Log.d("SharedStorage", "Retrieved appData: " + appData);
        callback.invoke(appData);
    }

    @ReactMethod
    public void getLastButtonClick(com.facebook.react.bridge.Callback callback) {
        SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        int buttonId = sharedPref.getInt("last_button_click", 0);
        android.util.Log.d("SharedStorage", "Retrieved last button click: " + buttonId);

        // Clear the button click after retrieving
        if (buttonId > 0) {
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putInt("last_button_click", 0);
            editor.commit();
        }

        callback.invoke(buttonId);
    }

    @ReactMethod
    public void addWidget(com.facebook.react.bridge.Callback callback) {
        try {
            android.util.Log.d("SharedStorage", "Adding widget to home screen");

            // Get AppWidgetManager
            AppWidgetManager appWidgetManager = AppWidgetManager
                    .getInstance(getCurrentActivity().getApplicationContext());

            // Get widget component
            android.content.ComponentName componentName = new android.content.ComponentName(
                    getCurrentActivity().getApplicationContext(),
                    CarMarketsWidget.class);

            // Check if widget is available
            if (appWidgetManager.isRequestPinAppWidgetSupported()) {
                // Create PendingIntent for widget configuration
                Intent intent = new Intent(getCurrentActivity().getApplicationContext(),
                        getCurrentActivity().getClass());
                intent.setAction(Intent.ACTION_MAIN);
                intent.addCategory(Intent.CATEGORY_LAUNCHER);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);

                android.app.PendingIntent pendingIntent = android.app.PendingIntent.getActivity(
                        getCurrentActivity().getApplicationContext(),
                        0,
                        intent,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);

                // Request to pin widget
                appWidgetManager.requestPinAppWidget(componentName, null, pendingIntent);
                android.util.Log.d("SharedStorage", "Widget pin request sent");
                callback.invoke("success", "Widget added successfully");
            } else {
                android.util.Log.e("SharedStorage", "Widget pinning not supported");
                callback.invoke("error", "Widget pinning not supported on this device");
            }
        } catch (Exception e) {
            android.util.Log.e("SharedStorage", "Error adding widget: " + e.getMessage());
            callback.invoke("error", "Failed to add widget: " + e.getMessage());
        }
    }

    @ReactMethod
    public void checkWidgetSupport(com.facebook.react.bridge.Callback callback) {
        try {
            AppWidgetManager appWidgetManager = AppWidgetManager
                    .getInstance(getCurrentActivity().getApplicationContext());
            boolean isSupported = appWidgetManager.isRequestPinAppWidgetSupported();
            android.util.Log.d("SharedStorage", "Widget support check: " + isSupported);
            callback.invoke(isSupported);
        } catch (Exception e) {
            android.util.Log.e("SharedStorage", "Error checking widget support: " + e.getMessage());
            callback.invoke(false);
        }
    }

    @ReactMethod
    public void checkExistingWidgets(com.facebook.react.bridge.Callback callback) {
        try {
            AppWidgetManager appWidgetManager = AppWidgetManager
                    .getInstance(getCurrentActivity().getApplicationContext());
            android.content.ComponentName componentName = new android.content.ComponentName(
                    getCurrentActivity().getApplicationContext(),
                    CarMarketsWidget.class);
            int[] widgetIds = appWidgetManager.getAppWidgetIds(componentName);
            android.util.Log.d("SharedStorage", "Existing widgets count: " + widgetIds.length);
            callback.invoke(widgetIds.length);
        } catch (Exception e) {
            android.util.Log.e("SharedStorage", "Error checking existing widgets: " + e.getMessage());
            callback.invoke(0);
        }
    }
}