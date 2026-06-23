<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { newuserAPI, userLoginService } from '@/apis/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref()
const isRegister = ref(true)
const formModel = ref({ username: '', password: '', repassword: '' })

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 5,
      max: 10,
      pattern: /^[a-zA-Z0-9]\S{5,10}$/,
      message: '用户名必须是5-10位的非空英文字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

watch(isRegister, () => {
  formModel.value = { username: '', password: '', repassword: '' }
})

const userStore = useUserStore()

const register = async () => {
  await form.value.validate()
  const response = await newuserAPI({
    username: formModel.value.username,
    password: formModel.value.password
  })
  if (response.status === 0) {
    ElMessage.success(response.message)
    isRegister.value = false
  } else {
    ElMessage.error(response.message)
  }
}

const login = async () => {
  await form.value.validate()
  const response = await userLoginService({
    username: formModel.value.username,
    password: formModel.value.password
  })
  if (response.status === 0) {
    userStore.setToken(response.token)
    ElMessage.success(response.message)
    router.replace('/')
  } else {
    ElMessage.error(response.message)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-cover">
        <div class="cover-content">
          <img class="cover-logo" src="@/assets/images/logo.png" alt="McDL" />
          <h2 class="cover-title">美味，即刻开始</h2>
          <p class="cover-subtitle">注册/登录后即可点餐</p>
        </div>
      </div>

      <div class="login-form-wrap">
        <!-- 注册表单 -->
        <el-form
          v-if="isRegister"
          :model="formModel"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          class="login-form"
        >
          <h1 class="form-title">注册账号</h1>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="formModel.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="formModel.password"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              :prefix-icon="Lock"
              v-model="formModel.repassword"
              type="password"
              placeholder="请再次输入密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="btn-submit" type="primary" @click="register" auto-insert-space>
              注册
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 已有账号？去登录
            </el-link>
          </el-form-item>
        </el-form>

        <!-- 登录表单 -->
        <el-form
          v-else
          :model="formModel"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          class="login-form"
        >
          <h1 class="form-title">欢迎回来</h1>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="formModel.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="formModel.password"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item class="extra-row">
            <el-checkbox label="记住我" size="small" />
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-submit" type="primary" @click="login" auto-insert-space>
              登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="info" :underline="false" @click="isRegister = true">
              还没有账号？去注册 →
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff9e6 0%, #fff 50%, #fef0f0 100%);
}

.login-card {
  display: flex;
  width: 900px;
  min-height: 560px;
  border-radius: $mcRadiusLg;
  overflow: hidden;
  box-shadow: $mcShadowLg;
  background: $mcBgWhite;
}

.login-cover {
  width: 380px;
  flex-shrink: 0;
  background: $brandDark;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba($brandGold, 0.15) 0%, transparent 60%);
  }
}

.cover-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cover-logo {
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
  filter: brightness(0) invert(1);
}

.cover-title {
  font-size: 26px;
  font-weight: 700;
  color: $brandGold;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.cover-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.login-form-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.login-form {
  width: 100%;
  max-width: 320px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: $brandDark;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 2px;
}

.extra-row {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.btn-submit {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
  border-radius: $mcRadiusSm;
  background: $brandRed;
  border-color: $brandRed;

  &:hover {
    background: #c6281a;
    border-color: #c6281a;
  }
}
</style>
