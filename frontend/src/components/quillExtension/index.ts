import Quill from "quill";
import QuillCursors from "quill-cursors";

import CommentBlot from "./commentBlot";
import { CustomParagraph } from "./customPtag";
import HeaderNBlot from "./headerDynamicBlot";
import { MAX_HEADING_LEVEL } from "@/../config";

const customHeaders = [];
export default function quill_import() {
  Quill.register("modules/cursors", QuillCursors);
  const fonts = Quill.import("attributors/style/font");
  const Block = Quill.import("blots/block");
  Block.tagName = "p";
  fonts.whitelist = ["initial", "sans-serif", "serif", "monospace", "monlam"];

  Quill.register("modules/counter", function (quill, options) {
    var container = document.querySelector(options.container);
    quill.on("text-change", function () {
      var text = quill.getText();
      if (options.unit === "word") {
        container.innerText = text.split(/\s+/).length + " words";
      } else {
        container.innerText = text.length + " characters";
      }
    });
  });
  Quill.register(fonts, true);
  Quill.register(Block, true);

  Quill.register(CustomParagraph);
  Quill.register(CommentBlot);

  // Generate and register custom header blots
  for (let i = 1; i <= MAX_HEADING_LEVEL; i++) {
    const CustomHeader = HeaderNBlot(i);
    Quill.register(CustomHeader);
    customHeaders.push(CustomHeader);
  }
}
