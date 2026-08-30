package health.tria.app

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.ServiceWorkerClientCompat
import androidx.webkit.ServiceWorkerControllerCompat
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewFeature
import health.tria.app.databinding.ActivityMainBinding
import java.io.ByteArrayInputStream

/**
 * TRIA runs entirely from bundled assets.
 *
 * The app holds no INTERNET permission, and every request the WebView makes is
 * answered locally — the asset loader serves the bundle, and anything else gets
 * a 403 rather than a network call. That is the privacy claim the app makes on
 * its own About screen, so it is enforced here rather than merely intended.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    /**
     * Serving the bundle over https://appassets.androidplatform.net rather than
     * file:// gives the page a secure origin, which is what localStorage and the
     * service worker need in order to behave like they do in a browser.
     */
    private val assetLoader: WebViewAssetLoader by lazy {
        WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        applyWindowInsets()
        configureWebView()
        routeServiceWorkerThroughAssets()
        installBackHandler()

        if (savedInstanceState != null) {
            binding.webview.restoreState(savedInstanceState)
        } else {
            binding.webview.loadUrl(START_URL)
        }
    }

    /**
     * From Android 15 the app is laid out edge to edge whether it asks to be or
     * not, so pad the container by the system bars. The keyboard is folded into
     * the bottom inset to keep the doctor-brief notes field visible while typing.
     */
    private fun applyWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { view, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            view.setPadding(bars.left, bars.top, bars.right, maxOf(bars.bottom, ime.bottom))
            WindowInsetsCompat.CONSUMED
        }
    }

    private fun configureWebView() = with(binding.webview) {
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true          // the planner and brief persist here
            loadWithOverviewMode = true
            useWideViewPort = true
            builtInZoomControls = false
            displayZoomControls = false
            mediaPlaybackRequiresUserGesture = true

            // Nothing is ever loaded from the filesystem or a content provider.
            allowFileAccess = false
            allowContentAccess = false
        }

        /*
         * The page declares `color-scheme: dark light` and ships its own dark
         * palette, so WebView is asked to pass the system setting through as
         * prefers-color-scheme rather than to invert the page itself.
         */
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, true)
        }

        isVerticalScrollBarEnabled = true
        overScrollMode = WebView.OVER_SCROLL_IF_CONTENT_SCROLLS

        webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? = intercept(request.url)

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url
                if (url.host == ASSET_HOST) return false          // in-app navigation
                openExternally(url)                               // anything else leaves the app
                return true
            }
        }
    }

    /**
     * A service worker's own fetches do not pass through WebViewClient, so they
     * are routed here too. Without this the worker would try the network and the
     * offline bundle would fail exactly when it is needed most.
     */
    private fun routeServiceWorkerThroughAssets() {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)) return

        ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(
            object : ServiceWorkerClientCompat() {
                override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? =
                    intercept(request.url)
            }
        )
    }

    /** Asset bundle first; everything else is refused locally. */
    private fun intercept(url: Uri): WebResourceResponse? {
        if (url.host == ASSET_HOST) {
            assetLoader.shouldInterceptRequest(url)?.let { return it }
        }
        return blocked()
    }

    private fun blocked(): WebResourceResponse = WebResourceResponse(
        "text/plain",
        "utf-8",
        403,
        "Blocked - TRIA does not use the network",
        emptyMap(),
        ByteArrayInputStream(ByteArray(0))
    )

    private fun openExternally(url: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, url).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * The app is a hash router, so WebView history is the section history. Back
     * walks it, then leaves the app.
     */
    private fun installBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (binding.webview.canGoBack()) {
                    binding.webview.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.webview.saveState(outState)
    }

    override fun onPause() {
        binding.webview.onPause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        binding.webview.onResume()
    }

    override fun onDestroy() {
        binding.webview.destroy()
        super.onDestroy()
    }

    private companion object {
        const val ASSET_HOST = "appassets.androidplatform.net"
        const val START_URL = "https://$ASSET_HOST/assets/www/index.html"
    }
}
