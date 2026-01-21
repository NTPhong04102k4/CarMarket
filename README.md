# CarMarkets Widget Integration Guide

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [1. Chuẩn bị layout cho widget](#1-chuẩn-bị-layout-cho-widget)
- [2. Tạo preview cho widget](#2-tạo-preview-cho-widget)
- [3. Cấu hình widget provider](#3-cấu-hình-widget-provider)
- [4. Cập nhật AndroidManifest.xml](#4-cập-nhật-androidmanifestxml)
- [5. Logic xử lý widget trong Java](#5-logic-xử-lý-widget-trong-java)
- [6. Kết nối với React Native](#6-kết-nối-với-react-native)
- [7. Thêm màn hình hiển thị khi mở app từ widget](#7-thêm-màn-hình-hiển-thị-khi-mở-app-từ-widget)
- [8. Cập nhật navigation](#8-cập-nhật-navigation)
- [9. Clean & Build lại app](#9-clean--build-lại-app)
- [10. Kiểm tra và debug](#10-kiểm-tra-và-debug)
- [Lưu ý chung](#lưu-ý-chung)

---

## Giới thiệu

Tài liệu này hướng dẫn chi tiết cách tích hợp widget Android với 4 nút (3 nút mở app, 1 nút tăng số ngày) vào dự án React Native **CarMarkets**.

---

## 1. Chuẩn bị layout cho widget
- **File:** `android/app/src/main/res/layout/widget_layout.xml`
- Sử dụng `LinearLayout` chứa 2 `TextView` (tiêu đề, trạng thái) và 4 `Button` nằm ngang: Buy, Sell, Info, Increase.
- **Không dùng** `android:onClick` cho các nút này.

---

## 2. Tạo preview cho widget
- **File:** `android/app/src/main/res/drawable/widget_preview.xml`
- Dùng LinearLayout/TextView mô phỏng giao diện widget (không phải shape).
- Đảm bảo file không lỗi cú pháp.

---

## 3. Cấu hình widget provider
- **File:** `android/app/src/main/res/xml/widget_info.xml`
- Đặt các thuộc tính: minWidth, minHeight, initialLayout, previewImage, description, v.v.
- **Không dùng** `android:configure` nếu không có Activity cấu hình riêng cho widget.

---

## 4. Cập nhật AndroidManifest.xml
- **File:** `android/app/src/main/AndroidManifest.xml`
- Thêm permission:
  ```xml
  <uses-permission android:name="android.permission.BIND_APPWIDGET" />
  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
  ```
- Đăng ký receiver cho widget:
  ```xml
  <receiver android:name=".CarMarketsWidget" android:exported="true">
    <intent-filter>
      <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
      <action android:name="android.appwidget.action.APPWIDGET_ENABLED" />
      <action android:name="android.appwidget.action.APPWIDGET_DISABLED" />
      <action android:name="BUTTON_1_CLICK" />
      <action android:name="BUTTON_2_CLICK" />
      <action android:name="BUTTON_3_CLICK" />
      <action android:name="BUTTON_4_CLICK" />
    </intent-filter>
    <meta-data
      android:name="android.appwidget.provider"
      android:resource="@xml/widget_info" />
  </receiver>
  ```

---

## 5. Logic xử lý widget trong Java
- **File:** `android/app/src/main/java/com/carmarkets/CarMarketsWidget.java`
- Import đúng `ComponentName` từ `android.content.ComponentName`.
- Trong `updateAppWidget`, tạo các `PendingIntent` cho từng nút.
- Trong `onReceive`, phân biệt action từng nút:
  - 3 nút đầu (Buy, Sell, Info): Lưu lại buttonId, mở app.
  - Nút Increase: Tăng số ngày trong SharedPreferences, update lại widget, **không mở app**.
- Đảm bảo không có lỗi JSON hoặc null data.

---

## 6. Kết nối với React Native
- **File:** `src/screens/WidgetConfig/index.tsx`
- Khi app được mở từ widget (button 1,2,3): tự động chuyển sang màn hình mới (`WidgetButtonScreen`), truyền tên nút.
- Nếu là button 4 (Increase): chỉ tăng số ngày, không chuyển màn.
- Sử dụng navigation type-safe, fallback nếu navigation chưa sẵn sàng.

---

## 7. Thêm màn hình hiển thị khi mở app từ widget
- **File:** `src/screens/WidgetButtonScreen.tsx`
- Hiển thị nội dung: "chuyển màn sau khi ấn button X" với X là tên nút.

---

## 8. Cập nhật navigation
- **Files:**
  - `src/navigation/paths.ts`: Thêm đường dẫn `WidgetButtonScreen`.
  - `src/navigation/types.ts`: Thêm type cho màn hình mới.
  - `src/navigation/Application.tsx`: Thêm màn hình vào Stack.Navigator.

---

## 9. Clean & Build lại app
- **Lệnh:**
  ```bash
  cd android && ./gradlew clean
  cd .. && npx react-native run-android
  ```

---

## 10. Kiểm tra và debug
- Thêm widget lên home screen.
- Ấn từng nút để kiểm tra:
  - 3 nút đầu mở app và chuyển màn đúng.
  - Nút Increase chỉ tăng số ngày, không mở app.
- Nếu có lỗi, kiểm tra logcat:
  ```bash
  adb logcat | grep CarMarketsWidget
  ```

---

## Lưu ý chung
- Luôn kiểm tra lại file layout, file preview, file cấu hình widget.
- Nếu widget không load, kiểm tra lại các bước trên, đặc biệt là file preview, layout, và AndroidManifest.

---

**Nếu cần hướng dẫn chi tiết hơn cho từng file hoặc xuất ra PDF, vui lòng liên hệ!** 