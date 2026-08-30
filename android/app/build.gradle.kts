import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

/*
 * The web app at the repository root is the single source of truth. Rather than
 * keeping a second copy under src/main/assets, copy it in at build time. Sync
 * (not Copy) so a file deleted from the repo also disappears from the APK.
 */
val webAssetsDir = layout.buildDirectory.dir("generated/webAssets")

val syncWebAssets by tasks.registering(Sync::class) {
    description = "Bundles the TRIA web app into the APK's assets."
    group = "build"

    from(rootProject.projectDir.parentFile) {
        include("index.html", "manifest.webmanifest", "sw.js", "assets/**")
    }
    into(webAssetsDir.map { it.dir("www") })
}

tasks.named("preBuild") { dependsOn(syncWebAssets) }

android {
    namespace = "health.tria.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "health.tria.app"
        minSdk = 24
        targetSdk = 35
        // CI passes the run number so successive builds are distinguishable.
        versionCode = (System.getenv("TRIA_VERSION_CODE") ?: "1").toInt()
        versionName = System.getenv("TRIA_VERSION_NAME") ?: "1.0"
    }

    sourceSets["main"].assets.srcDir(webAssetsDir)

    signingConfigs {
        /*
         * Only created when the CI secrets are present. Without a stable key the
         * build falls back to debug signing, which installs fine but cannot
         * upgrade a previously installed copy in place.
         */
        val storeFilePath = providers.environmentVariable("TRIA_KEYSTORE").orNull
        if (!storeFilePath.isNullOrBlank()) {
            create("release") {
                storeFile = file(storeFilePath)
                storePassword = providers.environmentVariable("TRIA_KEYSTORE_PASSWORD").orNull
                keyAlias = providers.environmentVariable("TRIA_KEY_ALIAS").orNull
                keyPassword = providers.environmentVariable("TRIA_KEY_PASSWORD").orNull
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.findByName("release") ?: signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        viewBinding = true
    }

    packaging {
        resources.excludes += setOf("META-INF/*.version", "DebugProbesKt.bin", "kotlin-tooling-metadata.json")
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.webkit)
}
