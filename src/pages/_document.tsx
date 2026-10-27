import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 字体来源预连接：字体样式表由 _app 异步注入，避免阻塞首屏渲染 */}
        <link rel="preconnect" href="https://static.zeoseven.com" />
        <link rel="dns-prefetch" href="//static.zeoseven.com" />
        {/* 百度统计 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?5dd1291981c0ce9262475e9714893674";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
