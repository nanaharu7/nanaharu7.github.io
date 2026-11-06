"""手元で確認するためのプレビューを作る。

本番は GitHub Pages（Jekyll）が index.html を組み立てるが、手元には Jekyll がないので、
同じテンプレートの書き方（Liquid）を python-liquid で再現して preview.html に書き出す。
"""

import datetime
import json
import re
import sys
from pathlib import Path

import yaml
from liquid import Environment

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    env = Environment()
    # Jekyll 独自のフィルターのうち、テンプレートで使っているもの
    env.filters["jsonify"] = lambda value: json.dumps(value, ensure_ascii=False)

    source = (ROOT / "index.html").read_text(encoding="utf-8")
    # 先頭の「---」で囲まれた前置きは Jekyll 用なので外す
    source = re.sub(r"\A---\n.*?\n---\n", "", source, flags=re.S)
    data = yaml.safe_load((ROOT / "_data" / "content.yml").read_text(encoding="utf-8"))

    html = env.from_string(source).render(
        site={"data": {"content": data}, "time": datetime.datetime.now()}
    )
    out = ROOT / "preview.html"
    out.write_text(html, encoding="utf-8")
    print(out)


if __name__ == "__main__":
    try:
        main()
    except yaml.YAMLError as e:
        # 書き方の誤りは、場所がわかるように表示して止める
        print(f"_data/content.yml の書き方に誤りがあります:\n{e}", file=sys.stderr)
        sys.exit(1)
