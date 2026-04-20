import Collapse from './vendor/bootstrap/js/src/collapse.js'
import Tooltip from './vendor/bootstrap/js/src/tooltip.js'

window.bootstrap = window.bootstrap || {}
window.bootstrap.Collapse = Collapse
window.bootstrap.Tooltip = Tooltip

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (element) {
  new Tooltip(element)
})
