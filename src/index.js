import './assets/scss/main.scss'

function component() {
  const element = document.createElement('div')
  element.id = 'root'

  return element
}

document.body.appendChild(component())
