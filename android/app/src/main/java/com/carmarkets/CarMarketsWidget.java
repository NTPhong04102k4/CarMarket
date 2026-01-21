package com.carmarkets;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.ComponentName;
import android.widget.RemoteViews;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Implementation of App Widget functionality.
 */
public class CarMarketsWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
            int appWidgetId) {

        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":\"0 days\"}");
            android.util.Log.d("CarMarketsWidget", "Retrieved appData: " + appString);
            JSONObject appData = new JSONObject(appString);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
            views.setTextViewText(R.id.appwidget_text, appData.getString("text"));

            // Set up click listeners for buttons
            Intent intent1 = new Intent(context, CarMarketsWidget.class);
            intent1.setAction("BUTTON_1_CLICK");
            intent1.putExtra("button_id", 1);
            views.setOnClickPendingIntent(R.id.button_1, android.app.PendingIntent.getBroadcast(context, 1, intent1,
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE));

            Intent intent2 = new Intent(context, CarMarketsWidget.class);
            intent2.setAction("BUTTON_2_CLICK");
            intent2.putExtra("button_id", 2);
            views.setOnClickPendingIntent(R.id.button_2, android.app.PendingIntent.getBroadcast(context, 2, intent2,
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE));

            Intent intent3 = new Intent(context, CarMarketsWidget.class);
            intent3.setAction("BUTTON_3_CLICK");
            intent3.putExtra("button_id", 3);
            views.setOnClickPendingIntent(R.id.button_3, android.app.PendingIntent.getBroadcast(context, 3, intent3,
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE));

            Intent intent4 = new Intent(context, CarMarketsWidget.class);
            intent4.setAction("BUTTON_4_CLICK");
            intent4.putExtra("button_id", 4);
            views.setOnClickPendingIntent(R.id.button_4, android.app.PendingIntent.getBroadcast(context, 4, intent4,
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE));

            appWidgetManager.updateAppWidget(appWidgetId, views);
            android.util.Log.d("CarMarketsWidget", "Widget updated successfully");
        } catch (JSONException e) {
            android.util.Log.e("CarMarketsWidget", "JSON parsing error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        String action = intent.getAction();
        if (action != null) {
            switch (action) {
                case "BUTTON_1_CLICK":
                    handleButtonClick(context, 1);
                    break;
                case "BUTTON_2_CLICK":
                    handleButtonClick(context, 2);
                    break;
                case "BUTTON_3_CLICK":
                    handleButtonClick(context, 3);
                    break;
                case "BUTTON_4_CLICK":
                    handleIncreaseButtonClick(context);
                    break;
            }
        }
    }

    private void handleButtonClick(Context context, int buttonId) {
        android.util.Log.d("CarMarketsWidget", "Button " + buttonId + " clicked");

        // Save button click to SharedPreferences
        SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putInt("last_button_click", buttonId);
        editor.commit();
        android.util.Log.d("CarMarketsWidget", "Button click saved: " + buttonId);

        // Open the app
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            launchIntent.putExtra("widget_button_clicked", buttonId);
            context.startActivity(launchIntent);
        }
    }

    private void handleIncreaseButtonClick(Context context) {
        // Tăng số ngày trong appData (giả sử text là "X days")
        SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        String appString = sharedPref.getString("appData", "{\"text\":\"0 days\"}");
        int currentDays = 0;
        try {
            JSONObject appData = new JSONObject(appString);
            String text = appData.optString("text", "0 days");
            String[] parts = text.split(" ");
            if (parts.length > 0) {
                try {
                    currentDays = Integer.parseInt(parts[0]);
                } catch (NumberFormatException e) {
                    currentDays = 0;
                }
            }
            currentDays++;
            appData.put("text", currentDays + " days");
            // Lưu lại
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("appData", appData.toString());
            editor.commit();
            // Cập nhật widget
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName thisWidget = new ComponentName(context, CarMarketsWidget.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        } catch (JSONException e) {
            android.util.Log.e("CarMarketsWidget", "Increase button JSON error: " + e.getMessage());
        }
    }

    @Override
    public void onEnabled(Context context) {
        android.util.Log.d("CarMarketsWidget", "Widget enabled");
    }

    @Override
    public void onDisabled(Context context) {
        android.util.Log.d("CarMarketsWidget", "Widget disabled");
    }
}