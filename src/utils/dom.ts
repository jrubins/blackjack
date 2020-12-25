/**
 * Inserts a script into the DOM.
 */
export function insertScript({
  id,
  src,
  async = true,
}: {
  async?: boolean
  id: string
  src: string
}): void {
  if (document.getElementById(id)) {
    return
  }

  const scriptEl = document.createElement('script')
  scriptEl.id = id
  scriptEl.src = src
  scriptEl.async = async

  const firstJsEl = document.getElementsByTagName('script')[0]
  if (!firstJsEl.parentNode) {
    return
  }

  firstJsEl.parentNode.insertBefore(scriptEl, firstJsEl)
}
