import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 全局自定义字体（自托管 CDN，避免依赖 Google Fonts） */}
        <link
          rel="stylesheet"
          href="https://static.zeoseven.com/zsft/22/main/result.css"
        />
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
