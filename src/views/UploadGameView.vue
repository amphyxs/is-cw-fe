<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'
import { getCurrentAccount } from '@/shared/account'

const toast = useToast()
const router = useRouter()

const categories = ref([
  { name: 'Action', key: 'action' },
  { name: 'Strategy', key: 'strategy' },
  { name: 'Racing', key: 'racing' },
  { name: 'Casual', key: 'casual' },
  { name: 'RPG', key: 'rpg' },
  { name: 'Simulator', key: 'sim' },
  { name: 'Adventures', key: 'adventures' },
  { name: 'Sport', key: 'sport' },
])

const initialValues = reactive({
  gameName: '',
  description: '',
  category: [],
  url: '',
  price: '',
  pictureCoverUrl: '',
  pictureStoreUrl: '',
  pictureGameplayUrl1: '',
  pictureGameplayUrl2: '',
  pictureGameplayUrl3: '',
  normalItemName: '',
  normalItemPictureUrl: '',
  rareItemName: '',
  rareItemPictureUrl: '',
  legendaryItemName: '',
  legendaryItemPictureUrl: '',
})

const resolver = ({ values }) => {
  const errors = {}

  Object.entries(values).forEach(([key, value]) => {
    if (key !== 'undefined' && !value && value !== 0) {
      errors[key] = [{ message: 'Value is required.' }]
    }
  })

  return {
    errors,
  }
}

const uploadGame = (values) => {
  axios
    .post(
      'http://localhost:18124/dev/upload_game',
      {
        name: values.gameName.value,
        description: values.description.value,
        genres: values.category.value,
        game_url: values.url.value,
        price: values.price.value,
        picture_cover: values.pictureCoverUrl.value,
        picture_shop: values.pictureStoreUrl.value,
        picture_gameplay_1: values.pictureGameplayUrl1.value,
        picture_gameplay_2: values.pictureGameplayUrl2.value,
        picture_gameplay_3: values.pictureGameplayUrl3.value,
        devLogin: getCurrentAccount().login,
        common_item_name: values.normalItemName.value,
        common_item_url: values.normalItemPictureUrl.value,
        rare_item_name: values.rareItemName.value,
        rare_item_url: values.rareItemPictureUrl.value,
        legendary_item_name: values.legendaryItemName.value,
        legendary_item_url: values.legendaryItemPictureUrl.value,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Game was uploaded to store!',
        life: 3150,
      })
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while uploading game',
        life: 3150,
      })
    })
}

const onFormSubmit = (e) => {
  if (!e.valid) {
    return
  }

  uploadGame(e.states)
}
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-upload"></i>
      <h1 class="text-4xl">Upload game</h1>
    </div>
    <div class="main-panel__content w-full mt-5">
      <Card>
        <template #content>
          <Form
            v-slot="$form"
            :resolver="resolver"
            :initialValues="initialValues"
            @submit="onFormSubmit"
            class="flex flex-row p-5 gap-4 flex-wrap"
          >
            <div class="flex flex-col gap-1 w-64">
              <InputText name="gameName" type="text" placeholder="Game name" fluid />
              <Message
                v-if="$form.gameName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.gameName.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <Textarea name="description" type="text" placeholder="Game description" fluid />
              <Message
                v-if="$form.description?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.description.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText name="price" type="number" placeholder="Price" />
              <Message v-if="$form.price?.invalid" severity="error" size="small" variant="simple">{{
                $form.price.error?.message
              }}</Message>
            </div>
            <CheckboxGroup name="category" class="flex flex-col gap-1 w-64">
              <p class="text-xl">Categories</p>
              <div
                v-for="category of categories"
                :key="category.key"
                class="flex items-center gap-2"
              >
                <Checkbox :inputId="category.key" :value="category.name" />
                <label :for="category.key">{{ category.name }}</label>
              </div>
              <Message
                v-if="$form.category?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.category.error?.message }}</Message
              >
            </CheckboxGroup>
            <div class="flex flex-col gap-1 w-64">
              <InputText name="url" type="text" placeholder="Game files URL" fluid />
              <Message v-if="$form.url?.invalid" severity="error" size="small" variant="simple">{{
                $form.url.error?.message
              }}</Message>
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="pictureCoverUrl"
                type="text"
                placeholder="URL of cover picture"
                fluid
              />
              <Message
                v-if="$form.pictureCoverUrl?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.pictureCoverUrl.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="pictureStoreUrl"
                type="text"
                placeholder="URL of picture in store"
                fluid
              />
              <Message
                v-if="$form.pictureStoreUrl?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.pictureStoreUrl.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="pictureGameplayUrl1"
                type="text"
                placeholder="URL of gameplay picture #1"
                fluid
              />
              <Message
                v-if="$form.pictureGameplayUrl1?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.pictureGameplayUrl1.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="pictureGameplayUrl2"
                type="text"
                placeholder="URL of gameplay picture #2"
                fluid
              />
              <Message
                v-if="$form.pictureGameplayUrl2?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.pictureGameplayUrl2.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="pictureGameplayUrl3"
                type="text"
                placeholder="URL of gameplay picture #3"
                fluid
              />
              <Message
                v-if="$form.pictureGameplayUrl3?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.pictureGameplayUrl3.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="normalItemName"
                type="text"
                placeholder="Name of normal item"
                fluid
              />
              <Message
                v-if="$form.normalItemName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.normalItemName.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="normalItemPictureUrl"
                type="text"
                placeholder="Picture URL of normal item"
                fluid
              />
              <Message
                v-if="$form.normalItemPictureUrl?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.normalItemPictureUrl.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText name="rareItemName" type="text" placeholder="Name of rare item" fluid />
              <Message
                v-if="$form.rareItemName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.rareItemName.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="rareItemPictureUrl"
                type="text"
                placeholder="Picture URL of rare item"
                fluid
              />
              <Message
                v-if="$form.rareItemPictureUrl?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.rareItemPictureUrl.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="legendaryItemName"
                type="text"
                placeholder="Name of legendary item"
                fluid
              />
              <Message
                v-if="$form.legendaryItemName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.legendaryItemName.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-64">
              <InputText
                name="legendaryItemPictureUrl"
                type="text"
                placeholder="Picture URL of legendary item"
                fluid
              />
              <Message
                v-if="$form.legendaryItemPictureUrl?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.legendaryItemPictureUrl.error?.message }}</Message
              >
            </div>
            <Button type="submit" severity="primary" label="Upload" />
          </Form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style></style>
