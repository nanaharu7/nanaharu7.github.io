// 作品の詳細。一覧のボタンの data-work と対応させる
const WORKS = {
  "remind-bot": {
    kind: "Discord Bot",
    title: "remind-bot",
    text: "チームで分担したタスクの遅れを、進行管理の人が早めに把握するためのボット。期限が近づくと担当者にDMが届き、ボタンひとつで進捗を報告できます。",
    stack: "TypeScript / Cloudflare Workers / D1",
    image: "img/remind-bot.svg",
    imageAlt: "担当者に届いたリマインドで「期限を調整したい」を押すと、進行管理の人にメンション付きで知らせが届く図",
    link: "https://github.com/nanaharu7/remind-bot",
  },
  "animal-colony-manager": {
    kind: "Web App",
    title: "animal-colony-manager",
    text: "研究室のマウスの飼育ケージを、Googleスプレッドシートで管理するWebアプリ。交配から離乳までの記録、操作の取り消し、共用PCでの記入者の切り替えに対応しています。",
    stack: "Google Apps Script",
    link: "https://github.com/nanaharu7/animal-colony-manager",
  },
  anchorview: {
    kind: "VR Tool",
    title: "AnchorView",
    text: "VRChatのワールドの決まった場所に、ブラウザで再生している映像を固定して表示するツール。参加者それぞれが自分の画面を同じ場所に置くことで、みんなで一緒に観られます。",
    stack: "C# / OpenVR / UdonSharp",
    image: "img/anchorview.svg",
    imageAlt: "3人がそれぞれのブラウザで再生している映像が、ワールドの同じスクリーンに表示されている図",
    note: "Demo coming soon",
  },
  sodefuri: {
    kind: "iOS App",
    title: "sodefuri",
    text: "すれ違った人と、おすすめの本を交換するアプリ。位置情報を細かく扱わずに「近くにいた人」を判定し、サーバー費用をほぼかけずに動く構成にしています。",
    stack: "Flutter / Cloudflare Workers",
    note: "In development",
  },
  shiori: {
    kind: "iOS App",
    title: "shiori",
    text: "旅程をタイムラインで見て、地図や乗換案内にすぐ移れるアプリ。旅程は公開の形式で書けるので、AIに作らせることもできます。データは端末とiCloudだけに置きます。",
    stack: "Swift / iCloud",
    note: "In development",
  },
};

// メールアドレスは収集ボットに拾われないよう、逆順の断片から組み立てる
const mailLink = document.querySelector(".js-mail");
if (mailLink) {
  const address = ["moc.liamg", "skrow.urahanan"].map((s) => [...s].reverse().join("")).reverse().join("@");
  mailLink.href = `mailto:${address}`;
  mailLink.querySelector("span").textContent = address;
}

// スクロールしたらヘッダーに背景をつける
const header = document.querySelector(".top");
const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const dialog = document.getElementById("detail");
const $ = (selector) => dialog.querySelector(selector);

document.querySelectorAll(".work").forEach((button) => {
  button.addEventListener("click", () => {
    const work = WORKS[button.dataset.work];
    if (!work) throw new Error(`作品の定義がありません: ${button.dataset.work}`);

    const image = $(".detail-image");
    image.hidden = !work.image;
    if (work.image) {
      image.src = work.image;
      image.alt = work.imageAlt;
    }
    $(".detail-kind").textContent = work.kind;
    $(".detail-title").textContent = work.title;
    $(".detail-text").textContent = work.text;
    $(".detail-stack").textContent = work.stack;
    const foot = $(".detail-foot");
    foot.replaceChildren();
    if (work.link) {
      const a = document.createElement("a");
      a.href = work.link;
      a.textContent = "GitHub →";
      foot.append(a);
    } else {
      foot.textContent = work.note;
    }
    dialog.showModal();
  });
});

$(".close").addEventListener("click", () => dialog.close());
// 枠の外をクリックしたら閉じる
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
