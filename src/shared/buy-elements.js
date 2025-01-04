import { ref } from 'vue'

export const isDraggingElementToBuy = ref(false)

export const startDragElementToBuy = (evt, element, elementType) => {
  console.log(element)

  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('element', JSON.stringify(element))
  evt.dataTransfer.setData('elementType', elementType)

  isDraggingElementToBuy.value = true
}

export const stopDragElementToBuy = () => {
  isDraggingElementToBuy.value = false
}
