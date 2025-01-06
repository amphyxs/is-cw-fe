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
      <h1 class="text-primary text-3xl">Sign up to Par Store</h1>
      <div class="flex flex-col gap-1 w-64">
        <InputText name="email" type="text" placeholder="Email" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>
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
          :feedback="true"
          placeholder="Password"
          toggleMask
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1 w-64">
        <Password
          name="repeatPassword"
          type="text"
          :feedback="false"
          placeholder="Repeat password"
          toggleMask
          fluid
        />
        <Message
          v-if="$form.repeatPassword?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.repeatPassword.error?.message }}</Message
        >
      </div>
      <div class="flex items-center gap-2">
        <Checkbox inputId="is-dev-checkbox" name="isDev" value="Is developer" />
        <label for="is-dev-checkbox"> Is developer </label>
      </div>
      <Button type="submit" severity="secondary" label="Sign up" />
      <p>
        Already has an account?
        <RouterLink class="text-primary underline" to="/sign-in">Sign in</RouterLink>
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
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const initialValues = reactive({
  email: '',
  login: '',
  password: '',
  repeatPassword: '',
  isDev: false,
})

const resolver = ({ values }) => {
  const errors = {}

  if (!values.email) {
    errors.email = [{ message: 'Email is required.' }]
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = [{ message: 'Email has incorrect format.' }]
  }

  if (!values.login) {
    errors.login = [{ message: 'Login is required.' }]
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }]
  }

  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = [{ message: 'Passwords do not match.' }]
  }

  return {
    errors,
  }
}

const onFormSubmit = (e) => {
  if (!e.valid) {
    return
  }

  signUp({
    email: e.states.email.value,
    login: e.states.login.value,
    password: e.states.password.value,
    isDev: e.states.isDev.value,
  })
}

const signUp = ({ email, login, password, isDev }) => {
  const role = isDev ? 'ROLE_DEV' : 'ROLE_USER'

  axios
    .post('http://localhost:18124/auth/sign-up', {
      email,
      login,
      password,
      role,
    })
    .then((response) => {
      storeCurrentAccount({
        token: response.data.jwt,
        login: response.data.login,
        role,
        isTutorialCompleted: false,
      })

      router.push(role === 'ROLE_DEV' ? '/store' : '/account')
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response.data.message,
        life: 3150,
      })
    })
}
</script>
