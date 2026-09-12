package in.animekingdom.store;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.*;
import android.widget.Toast;
import android.util.Base64;
import java.io.*;

public class MainActivity extends Activity {
    private WebView web;
    private ValueCallback<Uri[]> chooser;
    private byte[] pendingDownload;
    private static final String PAGE = "https://appassets.androidplatform.net/index.html";

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        web.setBackgroundColor(0xff09050e);
        web.setOnApplyWindowInsetsListener((v, insets) -> {
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        setContentView(web);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(true);
        web.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new Downloads(), "AndroidDownloads");
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                if (r.getUrl().toString().split("#")[0].equals(PAGE)) {
                    try { return new WebResourceResponse("text/html", "UTF-8", getAssets().open("index.html")); }
                    catch(IOException e) { }
                }
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
                    new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri.toString().split("#")[0].equals(PAGE)) return false;
                if (!request.isForMainFrame()) return true;
                String scheme = uri.getScheme();
                if ("upi".equals(scheme) || "https".equals(scheme) || "mailto".equals(scheme)) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch(Exception e) { say("No compatible app installed. Copy the UPI ID to your payment app."); }
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (chooser != null) chooser.onReceiveValue(null);
                chooser = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"image/png", "image/jpeg", "image/webp"});
                try { startActivityForResult(intent, 1); }
                catch(Exception e) { chooser.onReceiveValue(null); chooser = null; say("Image picker unavailable."); }
                return true;
            }
        });
        web.loadUrl(PAGE);
    }
    private void say(String text) { Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }
    private class Downloads {
        @JavascriptInterface public void save(String name, String encoded, String mime) {
            if (encoded.length() > 12000000) { runOnUiThread(() -> say("Download is too large.")); return; }
            runOnUiThread(() -> {
                if (pendingDownload != null) { say("Finish the current download first."); return; }
                if (web.getUrl() == null || !web.getUrl().split("#")[0].equals(PAGE)) return;
                try {
                    pendingDownload = Base64.decode(encoded, Base64.DEFAULT);
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType(mime.equals("text/html") ? "text/html" : mime.equals("text/plain") ? "text/plain" : "application/json");
                    intent.putExtra(Intent.EXTRA_TITLE, name.replaceAll("[^a-zA-Z0-9._-]", "_"));
                    startActivityForResult(intent, 2);
                } catch(Exception e) { pendingDownload = null; say("Could not save download."); }
            });
        }
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == 1 && chooser != null) {
            chooser.onReceiveValue(result == RESULT_OK && data != null && data.getData() != null ? new Uri[]{data.getData()} : null);
            chooser = null;
        }
        if (request == 2) {
            if (result == RESULT_OK && data != null && data.getData() != null && pendingDownload != null) {
                try (OutputStream stream = getContentResolver().openOutputStream(data.getData())) {
                    stream.write(pendingDownload); say("File saved.");
                } catch(Exception e) { say("Could not save file."); }
            }
            pendingDownload = null;
        }
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("if(document.getElementById('modal').open){closeModal()}else{go('home')}", null);
    }
    @Override protected void onDestroy() {
        if (chooser != null) chooser.onReceiveValue(null);
        web.destroy(); super.onDestroy();
    }
}
