# Google Maps API Setup

You are currently encountering a `RefererNotAllowedMapError` because your API key has HTTP referrer restrictions enabled, but the current preview URL is not on the allowed list.

To fix this and re-enable Google Maps:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials).
2. Find the API Key you provided.
3. Under "Application restrictions" -> "Websites", add this exact URL (including the trailing slash, or as a wildcard):
   `https://ais-dev-l4gcgsrgwixwad4yppxz4q-506044933640.asia-southeast1.run.app/*`
4. Also add your shared preview URL if you intend to share this application:
   `https://ais-pre-l4gcgsrgwixwad4yppxz4q-506044933640.asia-southeast1.run.app/*`

The application has been updated to automatically gracefully fall back to the offline SVG map representation when this error occurs.
