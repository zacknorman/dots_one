;(function() {
  /* ===== Globals ===== */
  window.VERSION_THANK_EN = "Thank you for choosing Polarr."
  window.VERSION_THANK_CN = "感谢使用泼辣修图。"

  if (CONFIG.os === "windows") {
    window.STORE_TYPE = "windows"
  } else if (CONFIG.os === "osx") {
    window.STORE_TYPE = "osx"
  } else if (CONFIG.os === "web") {
    window.STORE_TYPE = "web"
  } else if (CONFIG.os === "android") {
    window.STORE_TYPE = "play"
  } else if (CONFIG.os === "chrome") {
    window.STORE_TYPE = "chrome"
  } else {
    window.STORE_TYPE = "ios"
  }

  window.MOBILE = CONFIG.platform === "mobile"

  window.FILTER_PACK_KEYS = [
    "co.polarr.ppe.free.filters.pack1",
    "co.polarr.ppe.free.filters.pack2",
    "co.polarr.ppe.purchase.filters.pack1",
    "co.polarr.ppe.purchase.filters.pack2",
    "co.polarr.ppe.purchase.filters.pack3",
    "co.polarr.ppe.purchase.filters.pack4",
    "co.polarr.ppe.purchase.filters.pack5",
    "co.polarr.ppe.purchase.filters.pack6",
    "co.polarr.ppe.purchase.filters.pack7",
    "co.polarr.ppe.purchase.filters.pack8",
    "co.polarr.ppe.purchase.filters.pack9",
    "co.polarr.ppe.purchase.filters.pack10",
    "co.polarr.ppe.purchase.filters.pack11",
    "co.polarr.ppe.purchase.filters.pack12",
  ]

  window.PURCHASE_KEYS_MAP = {
    pro_features: CONFIG.os === "android" ? "photo.editor.polarr.purchase.pro" : "co.polarr.ppe.purchase.pro",
    everything: "co.polarr.ppe.purchase.pro_all_filters",
    all_filters: "co.polarr.ppe.purchase.filters.all",
    local_adjustments: "co.polarr.ppe.purchase.local_adjustments",
    text_tool: "co.polarr.ppe.purchase.text_tool",
    denoise: "co.polarr.ppe.purchase.denoise",
    backup_filters: "co.polarr.ppe.purchase.custom_filter_sync",

    subscription_monthly: "monthly",
    subscription_yearly: "yearly",

    legacy_subscription_monthly: "monthly",
    legacy_subscription_yearly: "yearly",
    legacy_android_premium_discount: "co.polarr.ppe.subscribe.premium",
    legacy_android_premium: "co.polarr.ppe.subscribe.premium.no_discount",
    legacy_android_premium_yearly: "co.polarr.ppe.subscribe.premium.yearly",
  }


  switch (CONFIG.os) {
    case "ios":
      PURCHASE_KEYS_MAP.subscription_monthly = "co.polarr.ppe.subscribe.premium.all_platforms.monthly.v5.0.0"
      PURCHASE_KEYS_MAP.subscription_yearly = "co.polarr.ppe.subscribe.premium.all_platforms.yearly.v5.0.0"
      break
    case "osx":
      PURCHASE_KEYS_MAP.subscription_monthly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.monthly.v5.0.0"
      PURCHASE_KEYS_MAP.subscription_yearly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.yearly.v5.0.0"
      break
    case "windows":
      PURCHASE_KEYS_MAP.subscription_monthly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.monthly.v5.10.0"
      PURCHASE_KEYS_MAP.subscription_yearly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.yearly.v5.10.0"
      PURCHASE_KEYS_MAP.legacy_subscription_monthly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.monthly.v5.0.0"
      PURCHASE_KEYS_MAP.legacy_subscription_yearly = "co.polarr.ppe.desktop.subscribe.premium.all_platforms.yearly.v5.0.0"
      break
    case "android":
      PURCHASE_KEYS_MAP.subscription_monthly = "co.polarr.ppe.subscribe.premium.all_platforms.monthly.v5.10.0"
      PURCHASE_KEYS_MAP.subscription_yearly = "co.polarr.ppe.subscribe.premium.all_platforms.yearly.v5.10.0"
      PURCHASE_KEYS_MAP.legacy_subscription_monthly = "co.polarr.ppe.subscribe.premium.all_platforms.monthly.v5.0.0"
      PURCHASE_KEYS_MAP.legacy_subscription_yearly = "co.polarr.ppe.subscribe.premium.all_platforms.yearly.v5.0.0"
      break
  }

  window.splashScreen = {
    hide: function() {
      const splash = document.getElementById("splash")
      if (!splash) {
        return
      }
      setTimeout(function() {
        splash.style.opacity = 0
        setTimeout(function() {
          if (splash.parentNode) splash.parentNode.removeChild(splash)
        }, 300)
      }, CONFIG.demoMode ? 2000 : 1)
    },
    setHTML: function(html) {
      const splash = document.getElementById("splash")
      if (!splash) {
        return
      }
      splash.innerHTML = html
    },
  }

  window.URLParams = {}
  var params = location.search ? location.search.split("?")[1].split("&") : []
  params.forEach(function(param) {
    var pair = decodeURIComponent(param).split("=")
    URLParams[pair[0]] = pair[1]
  })

  if (URLParams.debug) {
    CONFIG.debug = true
    ;(function() {
      var old = console.log
      var logger = document.createElement("pre")
      document.body.appendChild(logger)
      console.log = function() {
        for (var i = 0; i < arguments.length; i++) {
          if (typeof arguments[i] == "object") {
            logger.innerHTML +=
              (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + "<br />"
          } else {
            logger.innerHTML += arguments[i] + "<br />"
          }
        }
      }
      console.error = console.log
    })()
  }

  /* ===== Set default mode for mobile ===== */

  if (CONFIG.platform === "mobile") {
    window.document.body.className = "disabled portrait-mode"
  }

  /* ===== Disable contextmenu for IE and Chrome on Windows ===== */

  if (!CONFIG.debug && CONFIG.os !== "android") {
    window.document.body.addEventListener("contextmenu", function(e) {
      e.preventDefault()
    })
  }

  /* ===== Logging ===== */

  var now = (function() {
    var _performance = window.performance || Date
    return function() {
      return _performance.now.apply(_performance)
    }
  })()

  const logTimes = {}

  window.logTime = function(name) {
    if (CONFIG.debug) {
      logTimes[name] = now()
    }
  }

  window.logTimeEnd = function(name) {
    if (CONFIG.debug) {
      var args = Array.prototype.slice.call(arguments)
      var time = (now() - logTimes[name]).toFixed(3)
      args[0] = name + ": " + time + "ms"
      if (typeof POIPCManager !== "undefined") alert(JSON.stringify(args))
      console.log.apply(console, args)
      // console.trace(...args)
    }
  }

  window.log = function() {
    var args = Array.prototype.slice.call(arguments)
    if (typeof POIPCManager !== "undefined") alert(JSON.stringify(args))
    console.log.apply(console, args)
    // console.trace(...args)
  }

  window.addEventListener("error", function(e) {
    var filename = e.filename.lastIndexOf("/")
    var datetime = new Date().toString()
    var errorData = {
      type: e.type,
      path: e.filename,
      filename: e.filename.substring(++filename),
      line: e.lineno,
      column: e.colno,
      error: e.message,
      stackTrace: e.error ? e.error.stack.toString().replace(/(\r\n|\n|\r)/gm, "") : "",
      datetime: datetime,
    }

    log(e, errorData)
  })

  /* ===== Utility Functions ===== */

  var loadScript = function(src, load, error) {
    var script = document.createElement("script")
    script.src = src
    script.async = false
    script.onload = load
    script.onerror = error
    document.head.appendChild(script)
  }

  var createWorker = function(source) {
    var workerBlob = new Blob(["(" + source.toString() + "());"], { type: "text/javascript" })
    var workerURL = URL.createObjectURL(workerBlob)
    return new Worker(workerURL)
  }

  window.createWorker = createWorker

  var isWebGLSupported = function() {
    var canvas = document.createElement("canvas")

    var gl =
      (canvas.getContext("webgl")) ||
      (canvas.getContext("experimental-webgl"))

    return gl !== null
  }

  /* ===== Scrips ===== */

  var loadScripts = function() {
    var scripts = CONFIG.scripts || []
    scripts.forEach(loadScript)
  }

  var openURL = function(url) {
    if (typeof Electron !== "undefined") {
      Electron.shell.openExternal(url)
    } else {
      window.open(url, "_blank")
    }
  }

  window.__updateDriver = function() {
    openURL("https://wiki.polarr.co/wiki/support/Driver-error.html")
  }

  var delay = CONFIG.embedded && CONFIG.debug ? 2000 : 0

  if (isWebGLSupported()) {
    setTimeout(loadScripts, delay)
  } else {
    splashScreen.setHTML(
      "<div class='error' style='font-family: sans-serif;'>" +
      "<h1 style='line-height: 1.5em; padding: 20px'>Sorry, your graphics hardware or driver is not supported. Updating your graphics driver may fix this issue.</h1>" +
      "<a href='#' onclick='__updateDriver()' style='font-size: 1.8em'>How do I update my driver?</a>" +
      "</div>"
    )
  }

  /* ===== Analytics ===== */

  // chrome app doesn't like localstorage nor do we use the analytics.js through web
  if (window.STORE_TYPE != "chrome") {
    var gaSrc = "https://www.google-analytics.com/analytics.js"

    // prettier-ignore
    ;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script',gaSrc,'ga');

    var gaOptions = {
      storage: "none",
      // sampleRate: 5, // uncomment to set sample rate
    }

    switch (STORE_TYPE) {
      case "amazon":
      case "underground":
        ga("create", "UA-53563114-9", gaOptions)
        break

      case "baidu":
      case "play":
        ga("create", "UA-53563114-8", gaOptions)
        break

      case "windows":
        ga("create", "UA-53563114-11", gaOptions)
        break

      case "osx":
        ga("create", "UA-53563114-12", gaOptions)
        break

      case "web":
        ga("create", "UA-53563114-15", gaOptions)
        break

      default:
        // iOS
        ga("create", "UA-53563114-3", gaOptions)
        break
    }

    // We are using UA-53563114-2 for Google Chrome in google-analytics-bundle-polarr-mod.js

    ga("set", "checkProtocolTask", null)
    ga("send", "pageview")
    ga("send", "appview")
    ga("send", "event", "appload")
  }
})()
