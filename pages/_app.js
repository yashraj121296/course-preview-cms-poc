import '../styles/globals.css'
import {ContentfulLivePreviewProvider} from "@contentful/live-preview/react";

function MyApp({Component, pageProps}) {
    return (<ContentfulLivePreviewProvider
        locale="en-US"
        enableInspectorMode={false}
        enableLiveUpdates={true}
    >
        <Component {...pageProps}/>
    </ContentfulLivePreviewProvider>)
}

export default MyApp
