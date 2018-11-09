import Mustache from 'mustache';

export function render(templateId, data) {
  Mustache.tags = ['[[', ']]'];
  const templateElement = document.getElementById(templateId);

  if (templateElement) {
    const output = Mustache.render(templateElement.innerHTML, data);
    templateElement.insertAdjacentHTML('afterend', output);
    templateElement.remove();
  }
}

export const filters = {
  ellipsis: (maxLength) => {
    return  () => (text, renderer) => ellipsis(renderer(text), maxLength)
  },
  clean: (cleanRegExp, replacement) => {
    return  () => (text, renderer) => renderer(text).replace(cleanRegExp, replacement)
  },
}

function ellipsis(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  let cutterPosition = text.indexOf(' ', maxLength - 1);
  if (cutterPosition === -1) {
    return text;
  }

  const lastChar = text[cutterPosition - 1];
  const removedFromTheEndChars = '.,';
  if (removedFromTheEndChars.indexOf(lastChar) > -1) {
    cutterPosition -= 1;
  }

  return `${text.slice(0, cutterPosition)}\u2026`;
}
