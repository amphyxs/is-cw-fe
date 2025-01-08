import { currentAccount, isLoggedIn } from '@/shared/account'
import axios from 'axios'
import { ref } from 'vue'

export const achievements = ref([])
export const newAchievemtToNotifyUser = ref(null)
export const achievementData = {
  'Hard gamer': {
    check: () => {
      const totalGamesLaucnhes = Number(localStorage.getItem('game-launches-count'))
      if (totalGamesLaucnhes > 3) {
        saveNewAchievementIfNotReceivedBefore('Hard gamer')
      }
      localStorage.setItem('game-launches-count', totalGamesLaucnhes + 1)
    },
    teardown: () => {
      localStorage.removeItem('game-launches-count', 0)
    },
    picture:
      'https://img.freepik.com/free-vector/skull-gaming-with-joy-stick-emblem-modern-style_32991-492.jpg',
  },
  'Rich man': {
    check: (balanceAmount) => {
      if (balanceAmount >= 500) {
        saveNewAchievementIfNotReceivedBefore('Rich man')
      }
    },
    teardown: () => {},
    picture:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmEaCzxiitOTuTuGFX2CO8rlZnpQqcXNEHKQ&s',
  },
  Trader: {
    check: () => {
      saveNewAchievementIfNotReceivedBefore('Trader')
    },
    teardown: () => {},
    picture:
      'https://media.licdn.com/dms/image/v2/C5603AQFRNYPkUbQVSw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517536347255?e=2147483647&v=beta&t=S61JqXwHpVBHcTn7RmTl3PWb4aefiCoX51-KQWiOxTk',
  },
}

export const getAllAchievements = () => {
  if (!isLoggedIn.value) {
    return
  }

  axios
    .get('http://localhost:18125/achievement', {
      headers: { Authorization: 'Bearer ' + currentAccount.value.token },
    })
    .then((response) => {
      achievements.value = response.data
    })
}

export const saveNewAchievementIfNotReceivedBefore = (achievementName) => {
  if (achievements.value.includes(achievementName)) {
    return
  }

  axios
    .post(
      'http://localhost:18125/achievement',
      {
        userId: currentAccount.value.login,
        achievementType: achievementName,
      },
      {
        headers: { Authorization: 'Bearer ' + currentAccount.value.token },
      },
    )
    .then(() => {
      newAchievemtToNotifyUser.value = achievementName
      getAllAchievements()
    })
}

export const checkAchievement = (achievementName, ...args) => {
  achievementData[achievementName].check(...args)
}

export const teardownAchivements = () => {
  Object.values(achievementData).forEach(({ teardown }) => teardown())
}
