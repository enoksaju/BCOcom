package org.bsc.cordova;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import android.os.Handler;
import android.os.Bundle;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cn.pda.serialport.SerialPort;
import com.handheld.Barcode1D.Barcode1DManager;

/**
 * This class echoes a string called from JavaScript.
 */
public class CDVOcom extends CordovaPlugin {

  private static String TAG = CDVOcom.class.getSimpleName();

  private static String ButtonsForScan = "";

  public static final String EVENTNAME_ERROR = "event name null or empty.";

  final java.util.Map<String, BroadcastReceiver> receiverMap = new java.util.HashMap<String, BroadcastReceiver>(10);

  private KeyReceiver keyReceiver;
  String BarCodeResult = "";
  BroadcastReceiver receive;

  private Handler mHandler = new Handler() {
    public void handleMessage(android.os.Message msg) {
      if (msg.what == Barcode1DManager.Barcode1D) {
        String data = msg.getData().getString("data");
        Log.d(TAG, "los datos del codigo de barras son:" + data);
        BarCodeResult = data;

        Bundle b = new Bundle();
        b.putString("data", BarCodeResult);
        fireEvent("scanner.read", toJsonObject(b));
      }
    };
  };

  /**
   *
   * @param eventName
   * @param data
   * @param           <T>
   */
  protected <T> void fireEvent(final String eventName, final Object data) {

    cordova.getActivity().runOnUiThread(new Runnable() {

      @Override
      public void run() {
        String method = null;

        if (data == null) {
          method = String.format("javascript:window.ocom.fireEvent( '%s', null );", eventName);
        } else if (data instanceof JSONObject) {
          method = String.format("javascript:window.ocom.fireEvent( '%s', %s );", eventName, data.toString());
        } else {
          method = String.format("javascript:window.ocom.fireEvent( '%s', '%s' );", eventName, data.toString());
        }
        CDVOcom.this.webView.loadUrl(method);
      }
    });
  }

  /**
   *
   * @param receiver
   * @param filter
   */
  protected void registerReceiver(android.content.BroadcastReceiver receiver, android.content.IntentFilter filter) {
    LocalBroadcastManager.getInstance(super.webView.getContext()).registerReceiver(receiver, filter);
  }

  /**
   *
   * @param receiver
   */
  protected void unregisterReceiver(android.content.BroadcastReceiver receiver) {
    LocalBroadcastManager.getInstance(super.webView.getContext()).unregisterReceiver(receiver);
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("start")) {
      ButtonsForScan = "";
      final String[] buttonsText = args.getString(0).split(",");
      Log.d(TAG, "Receibing  " + args.getString(0));
      for (String button : buttonsText) {

        Log.d(TAG, "Configuring " + button);
        if (button.trim().toLowerCase().equals("scan")) {
          ButtonsForScan += "134, ";
        } else if (button.trim().toLowerCase().equals("scan_right")) {
          ButtonsForScan += "132, ";
        } else if (button.trim().toLowerCase().equals("f1")) {
          ButtonsForScan += "131, ";
        } else if (button.trim().toLowerCase().equals("right")) {
          ButtonsForScan += "135, ";
        } else if (button.trim().toLowerCase().equals("left")) {
          ButtonsForScan += "133, ";
        }
      }

      Log.d(TAG, "buscando en:" + ButtonsForScan);

      Barcode1DManager.Open(mHandler);
      keyReceiver = new KeyReceiver();
      // Registered radio receivers
      IntentFilter filter = new IntentFilter();
      filter.addAction("android.rfid.FUN_KEY");
      filter.addAction("android.intent.action.FUN_KEY");
      // registerReceiver(keyReceiver, filter);
      Context context = this.cordova.getActivity().getApplicationContext();

      context.registerReceiver(keyReceiver, filter);

    } else if (action.equals("add1DScanListener")) {

      final BroadcastReceiver r = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, final Intent intent) {
          final Bundle b = intent.getExtras();
          Log.d(TAG, "firing event...");
          fireEvent("scanner.read", toJsonObject(b));
        }
      };
      Context context = this.cordova.getActivity().getApplicationContext();
      context.registerReceiver(r, new IntentFilter("scanner.read"));
      receiverMap.put("scanner.read", r);
      callbackContext.success();

    } else if (action.equals("remove1DScanListener")) {
      final BroadcastReceiver r = receiverMap.remove("scanner.read");
      if (r != null) {
        Context context = this.cordova.getActivity().getApplicationContext();
        context.unregisterReceiver(r);
      }
      callbackContext.success();
    } else if (action.equals("addKPListener")) {

      final BroadcastReceiver r = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, final Intent intent) {
          final Bundle b = intent.getExtras();
          fireEvent("key.function.press", toJsonObject(b));
        }
      };
      Context context = this.cordova.getActivity().getApplicationContext();
      context.registerReceiver(r, new IntentFilter("key.function.press"));
      receiverMap.put("key.function.press", r);
      callbackContext.success();

    } else if (action.equals("removeKPListener")) {
      final BroadcastReceiver r = receiverMap.remove("key.function.press");
      if (r != null) {
        Context context = this.cordova.getActivity().getApplicationContext();
        context.unregisterReceiver(r);
      }
      callbackContext.success();
    }

    else {
      return false;
    }
    return true;
  }

  /**
  *
  */
  @Override
  public void onDestroy() {
    // deregister receiver
    for (BroadcastReceiver r : receiverMap.values()) {
      unregisterReceiver(r);
    }
    receiverMap.clear();
    super.onDestroy();

  }

  /**
   * Credit:
   * https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent
   *
   * @param bundle
   * @param object
   * @return
   */
  private static Bundle toBundle(final Bundle bundle, JSONObject object) {
    if (bundle == null || object == null)
      return bundle;

    final java.util.Iterator<String> keys = object.keys();

    while (keys.hasNext()) {
      final String key = keys.next();

      if (object.isNull(key)) {
        continue;
      }

      final Object value = object.opt(key);

      if (value instanceof Boolean) {
        bundle.putBoolean(key, (Boolean) value);
      } else if (value instanceof Long) {
        bundle.putLong(key, (Long) value);
      } else if (value instanceof Double) {
        bundle.putDouble(key, (Double) value);
      } else if (value instanceof Integer) {
        bundle.putInt(key, (Integer) value);
      } else if (value instanceof JSONObject) {
        bundle.putBundle(key, toBundle(new Bundle(), (JSONObject) value));
      } else if (value instanceof JSONArray) {

        try {
          final JSONArray values = (JSONArray) value;

          final JSONArray index = new JSONArray();
          for (int i = 0; i < values.length(); ++i) {
            index.put(String.valueOf(i));
          }

          bundle.putBundle(key, toBundle(new Bundle(), values.toJSONObject(index)));
        } catch (JSONException e) {
          Log.w(TAG, String.format("error creating bundle from array for key %s", key), e);
        }
      } else {
        bundle.putCharSequence(key, String.valueOf(value));
      }
    }

    return bundle;
  }

  /**
   * Credit:
   * https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent
   *
   * @param bundle
   * @return
   */
  private static JSONObject toJsonObject(final Bundle bundle) {
    final JSONObject result = new JSONObject();

    if (bundle != null) {

      for (final String key : bundle.keySet()) {
        try {
          result.putOpt(key, toJsonValue(bundle.get(key)));
        } catch (JSONException e) {
          Log.w(TAG, String.format("error parsing Bundle key %s", key), e);
        }
      }

    }

    return result;
  }

  /**
   *
   * Credit:
   * https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent
   *
   * @param value
   * @return
   * @throws JSONException
   */
  private static Object toJsonValue(final Object value) {

    if (value == null)
      return JSONObject.NULL;

    if (value.getClass().isArray()) {
      final JSONArray result = new JSONArray();
      int length = java.lang.reflect.Array.getLength(value);
      for (int i = 0; i < length; ++i) {
        final Object v = java.lang.reflect.Array.get(value, i);
        try {
          result.put(i, toJsonValue(v));
        } catch (JSONException e) {
          Log.w(TAG, String.format("error parsing array element %d vaule %s", i, v), e);
        }
      }
      return result;
    } else if (value instanceof String || value instanceof Boolean || value instanceof Integer || value instanceof Long
        || value instanceof Double) {
      return value;
    } else {
      return String.valueOf(value);
    }
  }

  private boolean mIsPressed = false;

  private class KeyReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
      Log.d(TAG, "receiving Key");
      boolean defaultdown = false;
      int keycode = intent.getIntExtra("keyCode", 0);
      if (keycode == 0) {
        keycode = intent.getIntExtra("keycode", 0);
      }
      boolean keydown = intent.getBooleanExtra("keydown", defaultdown);
      if (keydown && !mIsPressed) {

        Log.d(TAG, "KeyReceive:" + new Integer(keycode).toString());
        Log.d(TAG, "buscando en:" + ButtonsForScan);

        if (ButtonsForScan.contains(new Integer(keycode).toString())) {
          Log.d(TAG, "scanner power on");
          mIsPressed = true;
          Barcode1DManager.Scan();
        } else {
          String ButtonPressed = "";
          switch (keycode) {
          case 134:
            ButtonPressed = "scan";
            break;
          case 132:
            ButtonPressed = "scan_right";
            break;
          case 131:
            ButtonPressed = "f1";
            break;
          case 135:
            ButtonPressed = "right";
            break;
          case 133:
            ButtonPressed = "left";
            break;
          default:
            ButtonPressed = "unknow";
          }

          Bundle b = new Bundle();
          b.putString("key", new Integer(keycode).toString());
          b.putString("button", ButtonPressed);
          fireEvent("key.function.press", toJsonObject(b));
        }

      } else {
        mIsPressed = false;
      }

    }
  }
}
