import { ref, computed, watchEffect } from 'vue'
import { currentAccount } from '@/shared/account'
import axios from 'axios'
import Router from '@/router'

const tutorialStageData = [
  { text: 'Click on a game to see details', navigation: '/store' },
  { text: 'Drag a game onto cart to buy it', navigation: null },
  { text: 'Your games are located in Library. You can launch it', navigation: '/library' },
  {
    text: 'You can buy special items from games from other players in Trading. Drag them to your cart too',
    navigation: '/trading',
  },
  {
    text: 'You can read interesting posts about gameplay or post your own in Guides',
    navigation: '/guides',
  },
  {
    text: 'Your items from trading are stored in inventory',
    navigation: '/account',
  },
  {
    text: 'Drag your inventory item here to sell it',
    navigation: '/account',
  },
]
const TIMEOUT_AFTER_NAVIGATION = 200

export const tutorialStage = ref(null)

export const popoverRef = ref()

watchEffect(async () => {
  if (tutorialStage.value === null) {
    return
  }

  if (tutorialStageData[tutorialStage.value - 1].navigation) {
    await Router.push(tutorialStageData[tutorialStage.value - 1].navigation)
    await new Promise((r) => setTimeout(r, TIMEOUT_AFTER_NAVIGATION))
  }

  const elementForEvent = document.getElementById(`tutorial-${tutorialStage.value}`)
  elementForEvent.dispatchEvent(new Event('tutorialEvent'))
  elementForEvent.classList.add('tutorial-viewing')
})

export const onEvent = (e) => {
  if (!isInTutorialMode.value) {
    return false
  }

  popoverRef.value.show(e)
  if (tutorialStage.value > 1) {
    popoverRef.value.alignOverlay()
  }
}

export const tutorialText = computed(() =>
  tutorialStage.value !== null ? tutorialStageData[tutorialStage.value - 1].text : null,
)

export const isInTutorialMode = computed(() => tutorialStage.value !== null)

export const startTutorialIfNotCompleted = () => {
  if (checkTutorialCompleted() && currentAccount.value.role !== 'ROLE_DEV') {
    return
  }

  tutorialStage.value = 1
}

export const nextTutorialStage = () => {
  popoverRef.value.hide()
  const elementForEvent = document.getElementById(`tutorial-${tutorialStage.value}`)
  elementForEvent.classList.remove('tutorial-viewing')
  tutorialStage.value++

  if (tutorialStage.value > tutorialStageData.length) {
    tutorialStage.value = null
    markTutorialAsCompleted()
  }
}

const checkTutorialCompleted = () => {
  return !!currentAccount.value.isTutorialCompleted
}

const markTutorialAsCompleted = async () => {
  popoverRef.value.hide()

  await axios.patch('http://localhost:18124/user/is-tutorial-completed', true, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + currentAccount.value.token,
    },
  })
  localStorage.setItem('isTutorialCompleted', true)

  location.reload()
}
