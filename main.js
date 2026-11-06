// 作品の詳細は _data/content.yml から書き出されたものを読む。一覧のボタンの data-work と id を対応させる
const WORKS = Object.fromEntries(
  JSON.parse(document.getElementById("works-data").textContent).map((work) => [work.id, work]),
);

// お問い合わせフォームは、ページを移動せずに送信して結果を表示する
const form = document.querySelector(".contact-form");
const formStatus = form.querySelector(".form-status");
const submitButton = form.querySelector("button[type=submit]");
const showStatus = (text, isError) => {
  formStatus.textContent = text;
  formStatus.classList.toggle("error", isError);
};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  showStatus("送信しています…", false);
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const detail = data?.errors?.map((err) => err.message).join(" / ");
      throw new Error(detail || `HTTP ${res.status}`);
    }
    form.reset();
    showStatus("送信しました。内容を確認して、メールでご返信します。", false);
  } catch (err) {
    console.error("お問い合わせの送信に失敗しました", err);
    showStatus(`送信できませんでした（${err.message}）。時間をおいて、もう一度お試しください。`, true);
  } finally {
    submitButton.disabled = false;
  }
});

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
      image.alt = work.image_alt;
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
