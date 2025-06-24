import type { AppProps } from "next/app";

function MyApp({
    Component, 
    pageProps: { session, ...pageProps }, 
   }: AppProps) {
    return (
     <html>
       <body>
         <Component {...pageProps} />
       </body>
     </html>   
    );
 }
 
 export default MyApp;