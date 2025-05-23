<template>
  <section class="container">
    <h2 id="tos">利用規約</h2>
    <p>
      本サービスは、AIによる悩み相談を提供するための情報提供サービスです。以下の内容をよく読み、ご理解のうえご利用ください。
    </p>
    <ul>
      <li>公序良俗に反する行為は禁止されています。</li>
      <li>提供される情報は参考目的であり、法的・医療的な助言ではありません。</li>
    </ul>

    <h2 id="privacy">プライバシーポリシー</h2>
    <p>
      本サービスでは、個人を特定できる情報は収集しません。やり取りされた内容はAI応答生成にのみ使用され、保存は行っていません。
    </p>

    <ul>
      <li>個人情報の収集：なし</li>
      <li>利用目的：AI応答の生成</li>
      <li>第三者提供：なし</li>
      <li>保存：セッション終了後に自動削除</li>
    </ul>

    <h2 id="support">サポート・よくある質問</h2>

    <h3>Q. サービスは無料ですか？</h3>
    <p>
      A.
      現在、本サービスは無料でご利用いただけますが、内部的にはOpenAIのAPIを使用しており、将来的に有料プランや利用制限が導入される可能性があります。ご理解のほどよろしくお願いいたします。
    </p>

    <h3>Q. 相談内容は保存されますか？</h3>
    <p>A. いいえ、やり取りは保存されません。</p>

    <h3>Q. 医療・法律の相談も可能ですか？</h3>
    <p>A. AIが参考情報を提供するのみです。最終判断は専門家にご相談ください。</p>

    <h3>Q. 問い合わせは？</h3>
    <p>A. ご質問やバグ報告は support@example.com までご連絡ください。</p>
  </section>
</template>

<style scoped lang="scss">
.container {
  margin-bottom: 1rem;
  z-index: 2;
  overflow: auto;
}

h2 {
  margin: 1rem 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;

  @media (max-width: 1024px) {
    font-size: 1.2rem;
  }
}

h3 {
  font-weight: bold;
}

ul {
  padding: 0 0 0 30px;
}
</style>
