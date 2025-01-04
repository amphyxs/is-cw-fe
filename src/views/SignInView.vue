<template>
  <div class="flex max-sm:flex-col">
    <Toast />

    <div
      class="w-[50vw] h-[100vh] bg-cover bg-clip-content bg-center max-sm:h-72 max-sm:w-[100vh]"
      :style="`background-image: url(${MainBannerImage});`"
    />

    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col justify-center items-center p-5 gap-4 w-[50vw] h-[100vh] max-sm:w-[100vw] max-sm:h-fit"
    >
      <h1 class="text-primary text-3xl">Sign in to Par Store</h1>
      <div class="flex flex-col gap-1 w-64">
        <InputText name="login" type="text" placeholder="Login" fluid />
        <Message v-if="$form.login?.invalid" severity="error" size="small" variant="simple">{{
          $form.login.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1 w-64">
        <Password
          name="password"
          type="text"
          :feedback="false"
          placeholder="Password"
          toggleMask
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message
        }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Sign in" />
      <p>
        Have no account?
        <RouterLink class="text-primary underline" to="/sign-up">Sign up</RouterLink>
      </p>
    </Form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import MainBannerImage from '@/assets/main-page-banner.jpg'
import axios from 'axios'
import { storeCurrentAccount } from '@/shared/account'

const toast = useToast()

const initialValues = reactive({
  login: '',
  password: '',
})

const resolver = ({ values }) => {
  const errors = {}

  if (!values.login) {
    errors.login = [{ message: 'Login is required.' }]
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }]
  }

  return {
    errors,
  }
}

const onFormSubmit = (e) => {
  if (!e.valid) {
    return
  }

  signIn({ login: e.states.login.value, password: e.states.password.value })
}

const signIn = ({ login, password }) => {
  axios
    .post('http://localhost:18124/auth/sign-in', {
      login,
      password,
    })
    .then((response) => {
      storeCurrentAccount({
        token: response.data.jwt,
        login: response.data.login,
        role: response.data.roles[0],
      })
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while signing in',
        life: 3150,
      })
    })
}
</script>
